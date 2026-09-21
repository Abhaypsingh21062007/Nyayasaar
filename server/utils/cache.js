/**
 * In-memory LRU & TTL cache for AI queries, clause explanations, and comparisons.
 * Improves performance by serving duplicate requests immediately without
 * hitting Gemini API or recalculating embeddings.
 */
export class ResponseCache {
  constructor(maxSize = 200, defaultTtlMs = 30 * 60 * 1000) { // 30 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Generates a deterministic hash key from prefix and arguments.
   * @param {string} prefix 
   * @param {string|object} data 
   * @returns {string}
   */
  createKey(prefix, data) {
    const raw = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `${prefix}:${Math.abs(hash)}`;
  }

  /**
   * Retrieves a cached entry if present and not expired.
   * Updates LRU ordering.
   * @param {string} key 
   * @returns {any|null}
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU order: remove and re-insert
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  /**
   * Saves a value in cache with TTL.
   * Evicts oldest entry if maxSize is exceeded.
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlMs 
   */
  set(key, value, ttlMs = this.defaultTtlMs) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first item in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Clears the entire cache.
   */
  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

export const queryCache = new ResponseCache();
