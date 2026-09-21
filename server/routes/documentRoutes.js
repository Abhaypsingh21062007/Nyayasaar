import { Router } from 'express';
import { uploadPdfMiddleware } from '../middleware/upload.js';
import { uploadLimiter, aiLimiter } from '../middleware/rateLimiter.js';
import {
  uploadDocument,
  getDocumentById,
  analyzeDocument,
  explainClause,
  chatDocument,
  compareDocuments,
} from '../controllers/documentController.js';

const router = Router();

// POST /api/documents/upload (protected by upload rate limiter)
router.post('/upload', uploadLimiter, uploadPdfMiddleware, uploadDocument);

// POST /api/documents/compare (protected by AI rate limiter)
router.post('/compare', aiLimiter, compareDocuments);

// POST /api/documents/:id/analyze (protected by AI rate limiter)
router.post('/:id/analyze', aiLimiter, analyzeDocument);

// POST /api/documents/:id/explain-clause (protected by AI rate limiter)
router.post('/:id/explain-clause', aiLimiter, explainClause);

// POST /api/documents/:id/chat (protected by AI rate limiter)
router.post('/:id/chat', aiLimiter, chatDocument);

// GET /api/documents/:id
router.get('/:id', getDocumentById);

export default router;
