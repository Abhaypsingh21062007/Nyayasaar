import path from 'path';

/**
 * Sanitizer utility for security hardening against:
 * 1. Path Traversal attacks in file uploads
 * 2. Prompt Injection attacks in AI LLM queries
 * 3. Script injection / HTML control characters
 */

/**
 * Sanitizes a filename to prevent directory traversal and special character exploits.
 * @param {string} originalName 
 * @returns {string} Safe base filename
 */
export function sanitizeFilename(originalName) {
  if (!originalName || typeof originalName !== 'string') {
    return 'document.pdf';
  }

  // Strip null bytes and control chars
  // eslint-disable-next-line no-control-regex
  let clean = originalName.replace(/[\x00-\x1f\x7f]/g, '');

  // Strip directory paths (e.g. ../../etc/passwd or C:\windows\...)
  clean = path.basename(clean);

  // Remove any remaining path separators and dangerous characters
  clean = clean.replace(/[/\\?%*:|"<>]/g, '_');

  // Collapse multiple dots / dashes / underscores
  clean = clean.replace(/\.{2,}/g, '.').replace(/_{2,}/g, '_').trim();

  if (!clean || clean === '.pdf') {
    clean = `document_${Date.now()}.pdf`;
  }

  return clean;
}

/**
 * Patterns commonly used in prompt injection attacks against LLMs.
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s*:\s*you\s+are/i,
  /forget\s+(everything|all)\s+you\s+(were|know)/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /bypass\s+(all\s+)?safety\s+filters/i,
  /jailbreak/i,
  /act\s+as\s+(dan|an\s+unfiltered|an\s+evil)/i,
];

/**
 * Sanitizes user prompt input before passing to AI service.
 * Neutralizes prompt escape delimiters and flags/neutralizes override patterns.
 * 
 * @param {string} input - Raw user query/question
 * @param {number} maxLength - Maximum allowable characters (default: 1000)
 * @returns {{ sanitized: string, flagged: boolean }}
 */
export function sanitizePromptInput(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return { sanitized: '', flagged: false };
  }

  let text = input.trim().slice(0, maxLength);

  // Check for malicious prompt injection patterns
  let flagged = false;
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      flagged = true;
      text = text.replace(pattern, '[neutralized directive]');
    }
  }

  // Neutralize prompt delimiters that might trick model into switching roles
  text = text
    .replace(/```/g, "'''")
    .replace(/<\|im_start\|>/gi, '')
    .replace(/<\|im_end\|>/gi, '')
    .replace(/\[SYSTEM\]/gi, '[USER_NOTE]')
    .replace(/\[ASSISTANT\]/gi, '[USER_NOTE]');

  return { sanitized: text, flagged };
}
