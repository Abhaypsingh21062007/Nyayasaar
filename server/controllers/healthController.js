import { config } from '../config/index.js';
import { vectorStore } from '../utils/vectorStore.js';

export function getHealth(req, res) {
  const geminiConfigured =
    Boolean(config.geminiApiKey) &&
    config.geminiApiKey !== 'your_gemini_api_key_here' &&
    config.geminiApiKey.length > 10;

  res.status(200).json({
    status: 'ok',
    service: 'NyayaSaar Document Intelligence API',
    version: '2.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    geminiConfigured,
    ragEnabled: geminiConfigured, // RAG uses same key for embeddings
    embeddingModel: config.embeddingModel,
    indexedDocuments: vectorStore.size,
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
  });
}
