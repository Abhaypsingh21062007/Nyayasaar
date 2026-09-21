/**
 * RAG Service — Retrieval-Augmented Generation pipeline for NyayaSaar.
 *
 * Pipeline:
 *   PDF text → chunk() → embedChunks() → vectorStore
 *   Query    → embedQuery() → cosineSimilarity() → top-K chunks → Gemini
 */

import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const CHUNK_SIZE = 400;       // characters per chunk (approx 80-100 tokens)
const CHUNK_OVERLAP = 80;     // overlap between consecutive chunks
const TOP_K = 5;              // number of chunks to retrieve per query
const EMBED_MODEL = 'text-embedding-004'; // Gemini embedding model (768-dim)

/* ─── Chunking ───────────────────────────────────────────────────────────── */

/**
 * Splits document text into overlapping chunks with estimated page numbers.
 * Strategy: split on sentence boundaries first, then merge to CHUNK_SIZE.
 *
 * @param {string} text - Clean extracted document text
 * @param {number} pageCount - Total page count (for page estimation)
 * @returns {Array<{ text: string, page: number|null, chunkIndex: number }>}
 */
export function chunkDocument(text, pageCount = 1) {
  if (!text || typeof text !== 'string' || !text.trim()) return [];

  const cleanText = text.trim();
  const totalChars = cleanText.length;
  const charsPerPage = totalChars / Math.max(pageCount, 1);

  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < cleanText.length) {
    let end = Math.min(start + CHUNK_SIZE, cleanText.length);

    // Try to break at sentence boundary (. ! ?) if not at end
    if (end < cleanText.length) {
      const lookback = cleanText.substring(end - 60, end);
      const lastSentenceEnd = Math.max(
        lookback.lastIndexOf('. '),
        lookback.lastIndexOf('! '),
        lookback.lastIndexOf('? '),
        lookback.lastIndexOf('.\n'),
        lookback.lastIndexOf('\n')
      );
      if (lastSentenceEnd > 20) {
        end = end - 60 + lastSentenceEnd + 1;
      }
    }

    const chunkText = cleanText.substring(start, end).trim();

    if (chunkText.length > 20) { // skip tiny chunks
      // Estimate page number from character position
      const midpoint = (start + end) / 2;
      const estimatedPage = Math.max(1, Math.min(
        pageCount,
        Math.ceil((midpoint / totalChars) * pageCount)
      ));

      chunks.push({
        text: chunkText,
        page: pageCount > 0 ? estimatedPage : null,
        chunkIndex,
      });
      chunkIndex++;
    }

    // Move forward with overlap
    start = end - CHUNK_OVERLAP;
    if (start <= 0 || start >= cleanText.length) break;
  }

  return chunks;
}

/* ─── Embeddings ─────────────────────────────────────────────────────────── */

/**
 * Generates an embedding vector for a single text string using Gemini.
 * @param {GoogleGenAI} ai - Initialized AI client
 * @param {string} text
 * @returns {Promise<number[]>} 768-dimensional float vector
 */
async function embedText(ai, text) {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: text,
  });

  // SDK returns { embeddings: [{ values: [...] }] } or { embedding: { values: [...] } }
  const embedding =
    response?.embeddings?.[0]?.values ||
    response?.embedding?.values ||
    null;

  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Embedding API returned an unexpected structure.');
  }

  return embedding;
}

/**
 * Creates embeddings for all chunks. Processes in batches to respect rate limits.
 * @param {Array<{ text: string, page: number|null, chunkIndex: number }>} chunks
 * @returns {Promise<Array<{ text: string, page: number|null, chunkIndex: number, embedding: number[] }>>}
 */
export async function embedChunks(chunks) {
  if (!chunks || chunks.length === 0) return [];

  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    // No API key: return chunks without embeddings (TF-IDF fallback will be used at query time)
    return chunks.map((c) => ({ ...c, embedding: null }));
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  // Process chunks in sequential batches to avoid rate-limit bursts
  const BATCH_SIZE = 5;
  const results = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (chunk) => {
        try {
          const embedding = await embedText(ai, chunk.text);
          return { ...chunk, embedding };
        } catch (err) {
          console.warn(`[RAG] Embedding failed for chunk ${chunk.chunkIndex}:`, err.message);
          return { ...chunk, embedding: null };
        }
      })
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    }

    // Small delay between batches to avoid hammering the API
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
}

/**
 * Embeds a user query string for similarity search.
 * @param {string} query
 * @returns {Promise<number[]|null>} embedding vector or null if no API key
 */
export async function embedQuery(query) {
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  try {
    return await embedText(ai, query);
  } catch (err) {
    console.warn('[RAG] Query embedding failed:', err.message);
    return null;
  }
}

/* ─── Vector Similarity ──────────────────────────────────────────────────── */

/**
 * Computes cosine similarity between two vectors.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} similarity in [0, 1]
 */
export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/* ─── TF-IDF Fallback ────────────────────────────────────────────────────── */

/**
 * Simple keyword-based relevance scoring as fallback when embeddings are unavailable.
 * Uses term frequency of query tokens in each chunk.
 *
 * @param {string} query
 * @param {Array<{ text: string, page: number|null, chunkIndex: number }>} chunks
 * @returns {Array<{ text: string, page: number|null, chunkIndex: number, relevance: number }>}
 */
function tfidfRelevance(query, chunks) {
  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'about', 'this', 'does', 'that',
    'with', 'have', 'from', 'they', 'will', 'been', 'each', 'their',
    'there', 'were', 'more', 'into', 'your', 'than', 'then', 'some',
  ]);

  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryTokens.length === 0) {
    return chunks.map((c) => ({ ...c, relevance: 0 }));
  }

  return chunks.map((chunk) => {
    const lowerText = chunk.text.toLowerCase();
    let matches = 0;

    for (const token of queryTokens) {
      // Count occurrences of each query token in the chunk
      let idx = 0;
      while ((idx = lowerText.indexOf(token, idx)) !== -1) {
        matches++;
        idx += token.length;
      }
    }

    const relevance = Math.min(1, matches / (queryTokens.length * 2));
    return { ...chunk, relevance };
  });
}

/* ─── Retrieval ──────────────────────────────────────────────────────────── */

/**
 * Retrieves the top-K most relevant chunks for a query.
 * Uses cosine similarity if embeddings are available, TF-IDF as fallback.
 *
 * @param {string} query - User question
 * @param {Array<{ text: string, page: number|null, chunkIndex: number, embedding: number[]|null }>} embeddedChunks
 * @param {number} topK
 * @returns {Array<{ text: string, page: number|null, chunkIndex: number, relevance: number }>}
 */
export async function retrieveRelevantChunks(query, embeddedChunks, topK = TOP_K) {
  if (!embeddedChunks || embeddedChunks.length === 0) return [];

  const hasEmbeddings = embeddedChunks.some((c) => Array.isArray(c.embedding));

  let scoredChunks;

  if (hasEmbeddings) {
    // Vector similarity search
    const queryEmbedding = await embedQuery(query);

    if (!queryEmbedding) {
      // embedQuery failed (rate limit etc.) — fall back to TF-IDF
      scoredChunks = tfidfRelevance(query, embeddedChunks);
    } else {
      scoredChunks = embeddedChunks.map((chunk) => ({
        ...chunk,
        relevance: chunk.embedding
          ? cosineSimilarity(queryEmbedding, chunk.embedding)
          : 0,
      }));
    }
  } else {
    // No embeddings stored — TF-IDF fallback
    scoredChunks = tfidfRelevance(query, embeddedChunks);
  }

  // Sort by relevance descending, take top-K
  const sorted = [...scoredChunks].sort((a, b) => b.relevance - a.relevance);
  return sorted.slice(0, topK).filter((c) => c.relevance > 0);
}

/**
 * Full RAG pipeline: chunk document text and embed all chunks.
 * Called at upload time to pre-build the vector index.
 *
 * @param {string} text - Extracted document text
 * @param {number} pageCount - Number of pages
 * @returns {Promise<Array<{ text: string, page: number|null, chunkIndex: number, embedding: number[]|null }>>}
 */
export async function buildDocumentIndex(text, pageCount) {
  const chunks = chunkDocument(text, pageCount);
  console.log(`[RAG] Document chunked into ${chunks.length} chunks`);

  const embedded = await embedChunks(chunks);
  const embeddedCount = embedded.filter((c) => c.embedding !== null).length;
  console.log(`[RAG] ${embeddedCount}/${chunks.length} chunks embedded`);

  return embedded;
}
