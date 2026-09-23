import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  maxFileSize: 10 * 1024 * 1024, // 10 MB limit
  allowedMimeTypes: ['application/pdf'],
  allowedExtensions: ['.pdf'],
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // ── Gemini AI ──────────────────────────────────────────────────────────────
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',

  // ── RAG Embeddings ──────────────────────────────────────────────────────────
  embeddingModel: 'text-embedding-004', // Gemini 768-dim embedding model

  // ── Supabase (optional — for persistent vector storage) ────────────────────
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};
