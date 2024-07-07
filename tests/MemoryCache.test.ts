import { MemoryCache } from '../src';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    jest.useFakeTimers();
    cache = new MemoryCache({ ttl: 1000, cleanupMode: 'interval' });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should set and get a value', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  test('should return undefined for expired keys', () => {
    cache.set('key', 'value');
    jest.advanceTimersByTime(1001);
    expect(cache.get('key')).toBeUndefined();
  });

  test('should delete a key', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.get('key')).toBeUndefined();
  });

  test('should clear all keys', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
  });

  test('should check if a key exists', () => {
    cache.set('key', 'value');
    expect(cache.has('key')).toBe(true);
    jest.advanceTimersByTime(1001);
    expect(cache.has('key')).toBe(false);
  });

  test("setting value at a bad time should not trigger cleanup", () => {
    cache.set("key", "value");
    jest.advanceTimersByTime(900);
    cache.set("key", "value");
    jest.advanceTimersByTime(500);
    expect(cache.get("key")).toBe("value");
  });


  test("check if previously registered interval persists after delete using interval cleanup mode", () => {
    cache.set("key", "value");
    cache.delete("key");
    jest.advanceTimersByTime(900);
    cache.set("key", "value");
    jest.advanceTimersByTime(500);
    expect(cache.get("key")).toBe("value");
  });

  test("check if previously registered interval persists after delete using timeout cleanup mode", () => {
    let cache = new MemoryCache({ ttl: 1000, cleanupMode: 'timeout' });
    cache.set("key", "value");
    cache.delete("key");
    jest.advanceTimersByTime(900);
    cache.set("key", "value");
    jest.advanceTimersByTime(500);
    expect(cache.get("key")).toBe("value");
  });


  test('should handle timeout cleanup mode', () => {
    let cache = new MemoryCache({ ttl: 1000, cleanupMode: 'timeout' });
    cache.set('key', 'value');
    jest.advanceTimersByTime(500);
    expect(cache.get('key')).toBe('value');
    jest.advanceTimersByTime(501);
    expect(cache.get('key')).toBeUndefined();
  });

  test("timeout stop should stop the cleanup process", () => {
    let cache = new MemoryCache({ ttl: 1000, cleanupMode: 'timeout' });
    cache.set("key", "value");
    cache.stop();
    jest.advanceTimersByTime(2000);
    expect(cache.get("key")).toBe("value");
  });

  test("interval stop should stop the cleanup process", () => {
    let cache = new MemoryCache({ ttl: 1000, cleanupMode: 'interval' });
    cache.set("key", "value");
    cache.stop();
    jest.advanceTimersByTime(2000);
    expect(cache.get("key")).toBe("value");
  });

  test("immediate cleanup should not remove keys", () => {
    let cache = new MemoryCache({ ttl: 1000, cleanupMode: 'immediate' });
    cache.set("key", "value");
    jest.advanceTimersByTime(2000);
    expect(cache.get("key")).toBe("value");
  });
});
