import { PDFParse } from 'pdf-parse';
import { cleanText, getTextMetrics } from '../utils/textCleaner.js';

/**
 * Validates that a buffer starts with standard PDF magic bytes "%PDF-"
 * @param {Buffer} buffer 
 * @returns {boolean}
 */
export function isValidPdfBuffer(buffer) {
  if (!buffer || buffer.length < 5) return false;
  // %PDF- in ASCII is [0x25, 0x50, 0x44, 0x46, 0x2D]
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

/**
 * Extracts and cleans text from a PDF buffer.
 * 
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} originalname - Original file name
 * @returns {Promise<{
 *   text: string,
 *   pageCount: number,
 *   wordCount: number,
 *   charCount: number,
 *   isEmpty: boolean,
 *   warning?: string
 * }>}
 */
export async function extractTextFromPdfBuffer(buffer, _originalname = 'document.pdf') {
  if (!isValidPdfBuffer(buffer)) {
    const error = new Error('Invalid PDF format. The file does not have a valid PDF header.');
    error.statusCode = 400;
    error.code = 'INVALID_PDF_HEADER';
    throw error;
  }

  let parser = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const pageCount = result.total || 0;
    const cleaned = cleanText(result.text || '');
    const { wordCount, charCount } = getTextMetrics(cleaned);

    const isEmpty = cleaned.length === 0;

    return {
      text: cleaned,
      pageCount,
      wordCount,
      charCount,
      isEmpty,
      warning: isEmpty
        ? 'The PDF contains no extractable text. It may be an image-only scan or an empty document.'
        : undefined,
    };
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    const errMessage = String(err.message || '').toLowerCase();
    const error = new Error();
    error.statusCode = 400;

    if (errMessage.includes('password')) {
      error.message = 'The PDF is password protected. Please provide an unprotected PDF.';
      error.code = 'PDF_PASSWORD_PROTECTED';
    } else {
      error.message = 'Corrupted or unreadable PDF file. Could not parse document content.';
      error.code = 'PDF_PARSE_FAILED';
    }

    throw error;
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch {
        // Safe disposal
      }
    }
  }
}
