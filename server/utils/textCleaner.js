/**
 * Clean and normalize raw extracted text from PDF documents.
 * 
 * @param {string} rawText 
 * @returns {string} cleanedText
 */
export function cleanText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let text = rawText;

  // 1. Remove pdf-parse page marker patterns like "\n\n-- 1 of 10 --\n\n"
  text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');

  // 2. Normalize Windows/Mac line breaks to standard \n
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 3. Remove null characters and non-printable control chars except \n and \t
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 4. Normalize multiple horizontal spaces and tabs on a line
  text = text.replace(/[^\S\n]+/g, ' ');

  // 5. Clean trailing spaces on individual lines
  text = text
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // 6. Collapse excessive blank lines (more than 2 consecutive newlines -> 2 newlines)
  text = text.replace(/\n{3,}/g, '\n\n');

  // 7. Final trim
  return text.trim();
}

/**
 * Calculate basic document text metrics
 * 
 * @param {string} text 
 * @returns {{ wordCount: number, charCount: number }}
 */
export function getTextMetrics(text) {
  if (!text) {
    return { wordCount: 0, charCount: 0 };
  }

  const charCount = text.length;
  const words = text.match(/\b\S+\b/g) || [];
  const wordCount = words.length;

  return { wordCount, charCount };
}
