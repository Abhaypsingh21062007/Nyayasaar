import rateLimit from 'express-rate-limit';

/**
 * Standardized rate limit error response generator.
 */
function createRateLimitHandler(message, code) {
  return (req, res /*, next */) => {
    res.status(429).json({
      success: false,
      error: message,
      code,
      retryAfter: res.getHeader('Retry-After') || '60',
    });
  };
}

/**
 * General API rate limiter — protects all endpoints from DoS.
 * 150 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'Too many requests to NyayaSaar API. Please slow down and try again shortly.',
    'RATE_LIMIT_EXCEEDED'
  ),
  skip: (req) => {
    // Skip rate limiter in test environment
    return process.env.NODE_ENV === 'test';
  },
});

/**
 * Upload rate limiter — protects upload endpoint from file flooding.
 * 20 uploads per 15 minutes per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'Upload limit reached (maximum 20 documents per 15 minutes). Please try again later.',
    'UPLOAD_RATE_LIMIT_EXCEEDED'
  ),
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * AI endpoint rate limiter — protects Gemini AI quota and compute resources.
 * 30 AI requests per minute per IP.
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'AI analysis quota rate limit reached. Please wait a moment before sending another request.',
    'AI_RATE_LIMIT_EXCEEDED'
  ),
  skip: () => process.env.NODE_ENV === 'test',
});
