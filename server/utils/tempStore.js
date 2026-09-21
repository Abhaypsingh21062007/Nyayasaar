/**
 * In-memory temporary store for holding parsed documents during active sessions.
 * Automatically cleans up expired items to prevent memory leaks without persisting to disk.
 */

class TempStore {
  constructor(ttlMs = 60 * 60 * 1000) { // default 1 hour TTL
    this.store = new Map();
    this.ttlMs = ttlMs;

    // Periodically evict expired documents every 15 minutes
    this.cleanupInterval = setInterval(() => this.evictExpired(), 15 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  save(data) {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = Date.now() + this.ttlMs;

    const record = {
      id,
      ...data,
      uploadedAt: new Date().toISOString(),
      expiresAt,
    };

    this.store.set(id, record);
    return record;
  }

  get(id) {
    const record = this.store.get(id);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.store.delete(id);
      return null;
    }

    return record;
  }

  delete(id) {
    return this.store.delete(id);
  }

  evictExpired() {
    const now = Date.now();
    for (const [id, record] of this.store.entries()) {
      if (now > record.expiresAt) {
        this.store.delete(id);
      }
    }
  }

  clear() {
    this.store.clear();
  }
}

export const tempStore = new TempStore();
