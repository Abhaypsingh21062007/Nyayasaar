import multer from 'multer';

/**
 * Centralized error handler middleware.
 * Ensures user-friendly error messages and prevents leaking server secrets/stack traces.
 */
export function errorHandler(err, req, res, _next) {
  // Multer-specific error codes
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File size exceeds the 10 MB limit. Please upload a smaller document.',
        code: 'FILE_TOO_LARGE',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file upload field.',
        code: 'UNEXPECTED_FILE_FIELD',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
      code: err.code,
    });
  }

  // Known custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || 'Validation error',
      code: err.code || 'VALIDATION_ERROR',
    });
  }

  // Catch-all internal server error (never leak sensitive stack traces or environment secrets)
  console.error('[NyayaSaar Server Error]:', err);
  return res.status(500).json({
    success: false,
    error: 'An unexpected error occurred while processing the document. Please try again.',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
