import {ImmediateCleanup} from "./ImmediateCleanup";
import {IntervalCleanup} from "./IntervalCleanup";
import {TimeoutCleanup} from "./TimeoutCleanup";

export type CleanupMode = "immediate" | "interval" | "timeout";

export type CacheConfig = {
  ttl?: number;
  cleanupMode: CleanupMode;
  interval?: number;
};

type CleanUp = {
  register: (key: string) => void;
  unregister: (key: string) => void;
  stop: () => void;
  clear: () => void;
}

export class MemoryCache {
  private cache = new Map<string, any>();
  private ttl: number;
  private readonly cleanupMode: CleanupMode;
  private cleanup: CleanUp;

  constructor(config: CacheConfig) {
    this.ttl = config.ttl || 1000 * 60 * 10;
    this.cleanupMode = config.cleanupMode || "timeout";

    const deleteCallback = this.deleteKeys.bind(this);
    switch (this.cleanupMode) {
      case "immediate":
        this.cleanup = new ImmediateCleanup();
        break;
      case "interval":
        this.cleanup = new IntervalCleanup(config.interval || 1000, this.ttl, deleteCallback);
        break;
      case "timeout":
        this.cleanup = new TimeoutCleanup(this.ttl, deleteCallback);
        break;
    }
  }

  public get(key: string): any {
    return this.cache.get(key);
  }

  public set(key: string, value: any): void {
    this.cleanup.register(key);
    this.cache.set(key, value);
  }

  public delete(key: string): void {
    this.cleanup.unregister(key);
    this.cache.delete(key);
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public clear(): void {
    this.cache.clear();
    this.cleanup.clear();
  }

  public stop(): void {
    this.cleanup.stop();
  }

  private deleteKeys(keys: string[]): void {
    for (const key of keys) {
      this.cache.delete(key);
    }
  }
}
