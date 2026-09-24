/**
 * Trap Detection Service
 * Pure, deterministic logic to identify deceptive web patterns.
 *
 * Expected Element Descriptor Shape (contract for Phase 6):
 * {
 *   role: string,            // 'button', 'link', 'checkbox', 'text', etc.
 *   text: string,            // visible/accessible text content
 *   attributes: {            // relevant DOM attributes
 *     download?: string,
 *     href?: string,
 *     checked?: boolean
 *   },
 *   computedStyle: {
 *     visible: boolean       // false if display:none, visibility:hidden, opacity:0, or off-screen
 *   },
 *   context: {
 *     formText?: string      // text content of surrounding form/container (useful for checkboxes)
 *   }
 * }
 */

/**
 * 1. Fake Close Button With Mismatched Action
 * Detects elements masquerading as "Close" buttons that actually trigger downloads or external links.
 */
const detectFakeCloseButton = (element) => {
  const isCloseText = /^(x|close|dismiss|cancel)$/i.test(element.text?.trim() || '');
  const isActionElement = element.role === 'button' || element.role === 'link';
  
  if (isActionElement && isCloseText) {
    const hasDownload = element.attributes?.download !== undefined;
    const hasExternalHref = element.attributes?.href && !element.attributes.href.startsWith('#');
    
    if (hasDownload || hasExternalHref) {
      return {
        flagged: true,
        category: 'fake-close-button-with-mismatched-action',
        reason: 'Element looks like a close button but triggers a download or external navigation.'
      };
    }
  }
  return { flagged: false };
};

/**
 * 2. Pre-checked Billing Checkbox
 * Detects checkboxes that default to checked and are surrounded by billing/subscription language.
 */
const detectPrecheckedBillingCheckbox = (element) => {
  if (element.role === 'checkbox' && element.attributes?.checked === true) {
    const contextText = (element.context?.formText || '') + ' ' + (element.text || '');
    const hasBillingKeywords = /(subscribe|auto-renew|recurring|monthly|yearly|subscription)/i.test(contextText);
    
    if (hasBillingKeywords) {
      return {
        flagged: true,
        category: 'prechecked-billing-checkbox',
        reason: 'Checkbox is pre-checked and surrounded by subscription/billing language.'
      };
    }
  }
  return { flagged: false };
};

/**
 * 3. Hidden Prompt Injection Text
 * Detects text injected into the DOM that is visually hidden to humans but readable by AI.
 */
const detectHiddenPromptInjection = (element) => {
  if (element.computedStyle?.visible === false) {
    const text = element.text || '';
    const hasInjectionKeywords = /(ignore previous instructions|system prompt|ai agent|bot instructions)/i.test(text);
    
    if (hasInjectionKeywords) {
      return {
        flagged: true,
        category: 'hidden-prompt-injection-text',
        reason: 'Text contains AI-targeted instructions but is visually hidden from the user.'
      };
    }
  }
  return { flagged: false };
};

/**
 * Main detection entry point. Evaluates an element against all rules.
 * @param {Object} element - The standardized element descriptor
 * @returns {Object} { flagged: boolean, category?: string, reason?: string }
 */
export const evaluateElement = (element) => {
  // We only run these three specific detectors per spec.
  const detectors = [
    detectFakeCloseButton,
    detectPrecheckedBillingCheckbox,
    detectHiddenPromptInjection
  ];

  for (const detector of detectors) {
    const result = detector(element);
    if (result.flagged) {
      return result;
    }
  }

  return { flagged: false };
};
