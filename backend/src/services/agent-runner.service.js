import { chromium } from 'playwright';
import { decideNextAction } from './groq.service.js';
import { evaluateElement } from './trap-detection.service.js';
import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_STEPS = 10;

/**
 * Executes a script in the browser context to extract a simplified DOM.
 */
const extractSimplifiedDOM = async (page) => {
  return await page.evaluate(() => {
    const elements = [];
    let idCounter = 0;

    // We only care about interactive elements or large text blocks
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
          if (['script', 'style', 'noscript', 'meta', 'link'].includes(tag)) return NodeFilter.FILTER_REJECT;
          
          if (['a', 'button', 'input', 'select', 'textarea'].includes(tag) || node.getAttribute('role')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      let role = 'text';
      let text = '';
      let attributes = {};
      const computedStyle = { visible: true };
      let elementNode = node;

      if (node.nodeType === Node.TEXT_NODE) {
        text = node.textContent.trim();
        elementNode = node.parentElement;
      } else {
        role = node.getAttribute('role') || node.tagName.toLowerCase();
        if (role === 'a') role = 'link';
        if (role === 'input' && node.type === 'checkbox') role = 'checkbox';
        text = node.innerText || node.value || '';
        
        // Extract specific attributes for detectors
        if (node.hasAttribute('download')) attributes.download = node.getAttribute('download') || '';
        if (node.hasAttribute('href')) attributes.href = node.getAttribute('href');
        if (node.type === 'checkbox') attributes.checked = node.checked;
      }

      // Check visibility (simplified)
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

      // Context
      let formText = '';
      if (elementNode && elementNode.closest('form')) {
        formText = elementNode.closest('form').innerText || '';
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

    // Shielded mode specific logic: strip hidden prompt injections from the DOM sent to LLM
    // We do this server-side to ensure the LLM never sees them.
    return elements;
  });
};

/**
 * Helper to log events to Supabase
 */
const logEvent = async (runId, stepNumber, eventType, detail = {}, trapCategory = null) => {
  await supabase.from('run_events').insert({
    run_id: runId,
    step_number: stepNumber,
    event_type: eventType,
    trap_category: trapCategory,
    detail
  });
};

/**
 * Main Agent Runner Loop
 */
export const runAgent = async (runId, targetUrl, mode, goal = "Navigate the page and complete the primary objective safely.") => {
  let browser = null;
  
  try {
    // 1. Mark run as running
    await supabase.from('runs').update({ status: 'running', started_at: new Date() }).eq('id', runId);
    
    // Launch Chromium with Render free-tier safe settings
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu',
        '--single-process'
      ]
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Timeout for navigation
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

    for (let step = 1; step <= MAX_STEPS; step++) {
      // 2. Capture DOM
      let dom = await extractSimplifiedDOM(page);

      // In shielded mode, filter out hidden text before sending to LLM (prevents prompt injection)
      const domForLLM = mode === 'shielded' 
        ? dom.filter(el => el.computedStyle.visible)
        : dom;

      // 3. Decide next action
      const actionDecision = await decideNextAction(goal, domForLLM);
      
      if (actionDecision.action === 'done') {
        await logEvent(runId, step, 'action_executed', { action: 'done', reason: actionDecision.reason });
        await supabase.from('runs').update({ status: 'completed', outcome: 'Goal met successfully', finished_at: new Date() }).eq('id', runId);
        break;
      }

      const targetElement = dom.find(el => el.id === actionDecision.elementId);
      if (!targetElement) {
        // Invalid LLM action
        await logEvent(runId, step, 'action_attempted', actionDecision);
        throw new Error('LLM chose a non-existent element');
      }

      await logEvent(runId, step, 'action_attempted', actionDecision);

      // 4 & 5. Shielded Mode Trap Detection (BEFORE execution)
      if (mode === 'shielded') {
        // Run detectors on the chosen element (and its context)
        const evaluation = evaluateElement(targetElement);
        
        if (evaluation.flagged) {
          // TRAP DETECTED!
          await logEvent(runId, step, 'trap_detected', evaluation, evaluation.category);
          await logEvent(runId, step, 'action_blocked', { reason: 'Blocked by Warden Shield' });
          
          // Reroute = abort safely for this demo
          await supabase.from('runs').update({ 
            status: 'blocked', 
            outcome: `Blocked trap: ${evaluation.category}`, 
            finished_at: new Date() 
          }).eq('id', runId);
          return; 
        }
      }

      // 7. Execute action
      if (actionDecision.action === 'click') {
        await page.click(`[data-warden-id="${actionDecision.elementId}"]`, { timeout: 5000 });
      } else if (actionDecision.action === 'type') {
        await page.fill(`[data-warden-id="${actionDecision.elementId}"]`, actionDecision.text, { timeout: 5000 });
      } else if (actionDecision.action === 'navigate') {
        // Handle arbitrary navigation if LLM returns a URL, but for simple DOM interaction clicking is preferred.
      }

      await logEvent(runId, step, 'action_executed', actionDecision);
      
      // Wait for network idle or timeout
      await page.waitForTimeout(1000); 

      if (step === MAX_STEPS) {
        await supabase.from('runs').update({ status: 'completed', outcome: 'Max steps reached', finished_at: new Date() }).eq('id', runId);
      }
    }
  } catch (err) {
    // 9. Unrecoverable error
    await supabase.from('runs').update({ 
      status: 'failed', 
      outcome: `Error: ${err.message}`, 
      finished_at: new Date() 
    }).eq('id', runId);
  } finally {
    // 10. ALWAYS cleanup
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};
