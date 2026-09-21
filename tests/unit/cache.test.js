import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ResponseCache } from '../../server/utils/cache.js';

describe('LRU Cache', () => {
  let cache;

  beforeEach(() => {
    vi.useFakeTimers();
    // Small cache size (3) and TTL (1 hour) for testing
    cache = new ResponseCache(3, 3600000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve values', () => {
    cache.set('key1', { value: 1 });
    expect(cache.get('key1')).toEqual({ value: 1 });
  });

  it('should evict the least recently used item when max size is reached', () => {
    cache.set('1', 'a');
    cache.set('2', 'b');
    cache.set('3', 'c');
    
    // access 1 to make it recently used
    cache.get('1');
    
    // add 4, which should evict 2 (least recently used)
    cache.set('4', 'd');

    expect(cache.get('1')).toBe('a');
    expect(cache.get('2')).toBeNull();
    expect(cache.get('3')).toBe('c');
    expect(cache.get('4')).toBe('d');
  });

  it('should expire items after TTL', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    // advance time by 2 hours
    vi.advanceTimersByTime(7200000);

    expect(cache.get('key1')).toBeNull();
  });

  it('should correctly generate cache keys', () => {
    const key = cache.createKey('chat', { id: 'doc1', question: 'hi' });
    // Expect the prefix plus a numeric hash
    expect(key).toMatch(/^chat:\d+$/);
  });
});
