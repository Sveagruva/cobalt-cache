
export class TimeoutCleanup {
  private deleteCallback: (keys: string[]) => void;
  private cacheTimeout: Map<string, NodeJS.Timeout | number> = new Map();
  private interval: number;

  constructor(interval: number, deleteCallback: (keys: string[]) => void) {
    this.interval = interval;
    this.deleteCallback = deleteCallback;
  }

  private startTimeout(key: string): NodeJS.Timeout | number {
    return setTimeout(() => {
      this.deleteCallback([key]);
      this.cacheTimeout.delete(key);
    }, this.interval);
  }

  public register(key: string): void {
    if (this.cacheTimeout.has(key)) {
      clearTimeout(this.cacheTimeout.get(key));
    }

    const timeout = this.startTimeout(key);
    this.cacheTimeout.set(key, timeout);
  }

  unregister(key: string): void {
    clearTimeout(this.cacheTimeout.get(key));
    this.cacheTimeout.delete(key);
  }

  public clear(): void {
    this.cacheTimeout.forEach(value => clearTimeout(value));
    this.cacheTimeout.clear();
  }

  public stop(): void {
    this.clear();
  }
}
