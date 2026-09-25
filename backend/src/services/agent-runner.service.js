import { chromium } from 'playwright';
import { decideNextAction } from './groq.service.js';
import { evaluateElement } from './trap-detection.service.js';
import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_STEPS = 10;

/**
 * Validates target URL against safety constraints.
 * Restricts private/loopback IP ranges unless targeting local test fixtures.
 */
export const validateTargetUrl = (urlStr) => {
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch (e) {
    throw new Error(`Invalid URL format: ${urlStr}`);
  }

  // 1. HTTP and HTTPS only (reject javascript:, file:, data:, etc.)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Forbidden protocol "${parsed.protocol}". Only HTTP and HTTPS URLs are permitted.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Allow local fixtures on port 3000
  const isLocalFixture = (hostname === 'localhost' || hostname === '127.0.0.1') && parsed.pathname.startsWith('/traps/');
  if (isLocalFixture) {
    return { isValid: true, isFixture: true };
  }

  // 3. Reject loopback, private RFC1918, and link-local ranges for arbitrary web requests
  const isLoopback = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  const isPrivateIp = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})$/.test(hostname);
  const isLinkLocal = /^169\.254\.\d{1,3}\.\d{1,3}$/.test(hostname);

  if (isLoopback || isPrivateIp || isLinkLocal) {
    throw new Error(`Access to private, loopback, or internal IP range (${hostname}) is restricted.`);
  }

  return { isValid: true, isFixture: false };
};

/**
 * Dismisses common cookie consent banners if present.
 */
const dismissCookieBanners = async (page) => {
  try {
    const candidateSelectors = [
      'button:has-text("Accept")',
      'button:has-text("Accept all")',
      'button:has-text("Allow all")',
      'button:has-text("Agree")',
      'button:has-text("I agree")',
      'button:has-text("Got it")',
      'button:has-text("Accept All Cookies")',
      'button:has-text("OK")',
      'a:has-text("Accept")',
      'a:has-text("Agree")'
    ];
    for (const selector of candidateSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 400 }).catch(() => false)) {
        await btn.click({ timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(300);
        break;
      }
    }
  } catch (e) {
    // Non-fatal if no cookie banner is matched
  }
};

/**
 * Executes a script in the browser context to extract a simplified DOM.
 * Limits element count and text length to keep prompt within token limits.
 */
const extractSimplifiedDOM = async (page) => {
  return await page.evaluate(() => {
    const elements = [];
    let idCounter = 0;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim().length > 5) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          }
          const tag = node.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'meta', 'link', 'svg', 'path'].includes(tag)) return NodeFilter.FILTER_REJECT;
          
          if (['a', 'button', 'input', 'select', 'textarea', 'h1', 'h2', 'h3'].includes(tag) || node.getAttribute('role')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      if (elements.length >= 60) break; // Bounded extraction limit

      let role = 'text';
      let text = '';
      let attributes = {};
      const computedStyle = { visible: true };
      let elementNode = node;

      if (node.nodeType === Node.TEXT_NODE) {
        text = node.textContent.trim().slice(0, 100);
        elementNode = node.parentElement;
      } else {
        role = node.getAttribute('role') || node.tagName.toLowerCase();
        if (role === 'a') role = 'link';
        if (role === 'input' && node.type === 'checkbox') role = 'checkbox';
        text = (node.innerText || node.value || '').trim().slice(0, 100);
        
        if (node.hasAttribute('download')) attributes.download = node.getAttribute('download') || '';
        if (node.hasAttribute('href')) attributes.href = (node.getAttribute('href') || '').slice(0, 120);
        if (node.type === 'checkbox') attributes.checked = node.checked;
      }

      if (elementNode) {
        const style = window.getComputedStyle(elementNode);
        const rect = elementNode.getBoundingClientRect();
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0' ||
          rect.width === 0 || rect.height === 0 ||
          rect.left < -1000 || rect.top < -1000
        ) {
          computedStyle.visible = false;
        }
      }

      // Ignore invisible text nodes
      if (node.nodeType === Node.TEXT_NODE && !computedStyle.visible) continue;

      let formText = '';
      if (elementNode && elementNode.closest('form')) {
        formText = (elementNode.closest('form').innerText || '').slice(0, 100);
      }

      const elementId = `el-${idCounter++}`;
      if (node.nodeType !== Node.TEXT_NODE) {
        node.setAttribute('data-warden-id', elementId);
      } else if (node.parentElement) {
        node.parentElement.setAttribute('data-warden-id', elementId);
      }

      elements.push({
        id: elementId,
        role,
        text,
        attributes,
        computedStyle,
        context: { formText }
      });
    }

    return elements;
  });
};

/**
 * Helper to log events to Supabase
 */
const logEvent = async (runId, stepNumber, eventType, detail = {}, trapCategory = null) => {
  const { error } = await supabase.from('run_events').insert({
    run_id: runId,
    step_number: stepNumber,
    event_type: eventType,
    trap_category: trapCategory,
    detail
  });
  if (error) {
    console.error(`Failed to log event ${eventType} for run ${runId}:`, error.message);
  }
};

/**
 * Main Agent Runner Loop
 */
export const runAgent = async (runId, targetUrl, mode, goal) => {
  let browser = null;
  const effectiveGoal = (goal && goal.trim()) 
    ? goal.trim() 
    : "Explore the page, dismiss any intrusive popups or overlays, and interact with the primary content links.";
  
  try {
    // 1. Validate target URL
    const { isFixture } = validateTargetUrl(targetUrl);

    // 2. Persona Selection & Safety Guard
    let persona = 'standard';
    if (isFixture) {
      persona = 'naive_fixture';
    } else {
      persona = 'standard';
      if (mode === 'unshielded') {
        // Log visible notice of persona substitution on real websites using allowed schema enum
        await logEvent(runId, 0, 'action_rerouted', {
          notice: 'Real-world website target: Naive persona substituted with standard judgment-capable persona for open-web safety.',
          requested_mode: mode,
          effective_persona: 'standard'
        });
      }
    }

    // 3. Mark run as running
    await supabase.from('runs').update({ status: 'running', started_at: new Date() }).eq('id', runId);
    
    // 4. Launch isolated Chromium browser context
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      acceptDownloads: false, // Prevent automated downloading to disk
    });

    const page = await context.newPage();

    // Auto-dismiss unsolicited popup windows or ad tabs (only secondary pages, not the primary page)
    context.on('page', async (popup) => {
      if (popup === page) return;
      try {
        await popup.waitForTimeout(500);
        await popup.close().catch(() => {});
      } catch (e) {}
    });

    // Prevent background downloads
    page.on('download', (download) => {
      download.cancel().catch(() => {});
    });
    
    // 5. Navigate with bounded timeout on domcontentloaded
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (navErr) {
      if (navErr.message.includes('ERR_ABORTED') || navErr.message.includes('detached')) {
        await page.waitForLoadState('domcontentloaded').catch(() => {});
      } else {
        throw navErr;
      }
    }

    // Allow client-side JavaScript / Single Page Application hydration
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2500);

    // 6. Dismiss any standard cookie / consent banner
    await dismissCookieBanners(page);

    // 7. Initial page-wide trap detection scan (Shielded Mode)
    if (mode === 'shielded') {
      let currentHost = '';
      try { currentHost = new URL(page.url()).hostname; } catch (e) {}
      
      const initialElements = await extractSimplifiedDOM(page);
      for (const el of initialElements) {
        const check = evaluateElement(el, { currentHost });
        if (check.flagged) {
          await logEvent(runId, 0, 'trap_detected', {
            ...check,
            elementText: el.text || '',
            elementRole: el.role,
            elementHref: el.attributes?.href || ''
          }, check.category);
        }
      }
    }

    for (let step = 1; step <= MAX_STEPS; step++) {
      // Allow brief settling before snapshotting DOM
      if (step > 1) {
        await page.waitForTimeout(1000);
      }

      // Capture DOM
      let dom = await extractSimplifiedDOM(page);

      // In shielded mode, filter out hidden text before sending to LLM (prevents prompt injection)
      const domForLLM = mode === 'shielded' 
        ? dom.filter(el => el.computedStyle.visible)
        : dom;

      // Decide next action using selected persona
      const actionDecision = await decideNextAction(effectiveGoal, domForLLM, persona);
      
      if (actionDecision.action === 'done') {
        await logEvent(runId, step, 'action_executed', { action: 'done', reason: actionDecision.reason });
        await supabase.from('runs').update({ status: 'completed', outcome: 'Goal met successfully', finished_at: new Date() }).eq('id', runId);
        break;
      }

      const targetElement = dom.find(el => el.id === actionDecision.elementId);
      if (!targetElement) {
        await logEvent(runId, step, 'action_attempted', actionDecision);
        await logEvent(runId, step, 'action_failed', { reason: 'LLM chose a non-existent element in DOM snapshot' });
        await supabase.from('runs').update({ status: 'failed', outcome: 'Element not found in snapshot', finished_at: new Date() }).eq('id', runId);
        break;
      }

      await logEvent(runId, step, 'action_attempted', actionDecision);

      // Shielded Mode Trap Detection (BEFORE execution)
      if (mode === 'shielded') {
        let currentHost = '';
        try {
          currentHost = new URL(page.url()).hostname;
        } catch (e) {}

        const evaluation = evaluateElement(targetElement, { currentHost });
        
        if (evaluation.flagged) {
          await logEvent(runId, step, 'trap_detected', evaluation, evaluation.category);
          await logEvent(runId, step, 'action_blocked', { reason: 'Blocked by Warden Shield' });
          
          await supabase.from('runs').update({ 
            status: 'blocked', 
            outcome: `Blocked trap: ${evaluation.category}`, 
            finished_at: new Date() 
          }).eq('id', runId);
          return; 
        }
      }

      // Re-resolve element live at execution time
      let targetLocator = page.locator(`[data-warden-id="${actionDecision.elementId}"]`).first();
      let isTargetVisible = await targetLocator.isVisible({ timeout: 2000 }).catch(() => false);

      if (!isTargetVisible && targetElement.text && targetElement.text.trim()) {
        const textSnippet = targetElement.text.trim().slice(0, 30);
        const fallbackLocator = page.getByText(textSnippet, { exact: false }).first();
        if (await fallbackLocator.isVisible({ timeout: 1500 }).catch(() => false)) {
          targetLocator = fallbackLocator;
          isTargetVisible = true;
        }
      }

      if (!isTargetVisible) {
        await logEvent(runId, step, 'action_failed', { 
          reason: `Target element "${actionDecision.elementId}" could not be resolved or interacted with live.`,
          decision: actionDecision
        });
        await supabase.from('runs').update({
          status: 'failed',
          outcome: `Target element not interactable at step ${step}`,
          finished_at: new Date()
        }).eq('id', runId);
        break;
      }

      // Execute action with resilient click handling
      if (actionDecision.action === 'click') {
        try {
          await targetLocator.click({ timeout: 4000 });
        } catch (clickErr) {
          await targetLocator.click({ force: true, timeout: 2000 }).catch(() => {});
        }
      } else if (actionDecision.action === 'type') {
        await targetLocator.fill(actionDecision.text || '', { timeout: 5000 });
      } else if (actionDecision.action === 'navigate') {
        // Handled via page interaction
      }

      await logEvent(runId, step, 'action_executed', actionDecision);
      
      await page.waitForTimeout(1500); 

      if (step === MAX_STEPS) {
        await supabase.from('runs').update({ status: 'completed', outcome: 'Max steps reached', finished_at: new Date() }).eq('id', runId);
      }
    }
  } catch (err) {
    // Unrecoverable error: log terminal event and update run status safely
    await logEvent(runId, 0, 'action_failed', { error: err.message });
    await supabase.from('runs').update({ 
      status: 'failed', 
      outcome: `Error: ${err.message}`, 
      finished_at: new Date() 
    }).eq('id', runId);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};
