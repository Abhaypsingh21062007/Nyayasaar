/**
 * In-memory vector store for document chunk embeddings.
 * Stores per-document arrays of embedded chunks for RAG retrieval.
 * Mirrors the TTL strategy of tempStore.js (1-hour eviction).
 */

class VectorStore {
  constructor(ttlMs = 60 * 60 * 1000) { // 1 hour
    this.store = new Map(); // documentId -> { chunks, expiresAt }
    this.ttlMs = ttlMs;

    // Evict expired entries every 15 minutes
    this.cleanupInterval = setInterval(() => this.evictExpired(), 15 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Save embedded chunks for a document.
   * @param {string} documentId
   * @param {Array<{ text: string, page: number|null, chunkIndex: number, embedding: number[] }>} chunks
   */
  save(documentId, chunks) {
    this.store.set(documentId, {
      chunks,
      savedAt: Date.now(),
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  /**
   * Retrieve embedded chunks for a document.
   * @param {string} documentId
   * @returns {Array<{ text: string, page: number|null, chunkIndex: number, embedding: number[] }>|null}
   */
  get(documentId) {
    const entry = this.store.get(documentId);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(documentId);
      return null;
    }

    return entry.chunks;
  }

  has(documentId) {
    return Boolean(this.get(documentId));
  }

  delete(documentId) {
    return this.store.delete(documentId);
  }

  evictExpired() {
    const now = Date.now();
    for (const [id, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(id);
      }
    }
  }

  get size() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }
}

export const vectorStore = new VectorStore();
