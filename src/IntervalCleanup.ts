

export class IntervalCleanup {
  private intervalId: NodeJS.Timeout | number;
  private ttl: number;
  private deleteCallback: (keys: string[]) => void;
  private items: {
    key: string;
    time: number;
  }[] = [];

  constructor(interval: number, ttl: number, deleteCallback: (keys: string[]) => void) {
    this.deleteCallback = deleteCallback;
    this.ttl = ttl;

    let isCleaning = false;
    this.intervalId = setInterval(() => {
      if (isCleaning) {
        return;
      }

      isCleaning = true;
      this.cleanUp();
    }, interval);
  }

  private cleanUp(): void {
    const now = Date.now();
    // Find the index up to which items are expired
    const index = this.items.findIndex(item => item.time > now);
    const lastIndex = index === -1 ? this.items.length : index;

    const expiredItems = this.items.slice(0, lastIndex);
    this.deleteCallback(expiredItems.map(item => item.key));
    this.items = this.items.slice(lastIndex);
  }

  public register(key: string): void {
    const index = this.items.findIndex(item => item.key === key);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.items.push({ key, time: Date.now() + this.ttl });
  }

  unregister(key: string): void {
    const index = this.items.findIndex(item => item.key === key);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  public clear(): void {
    this.items = [];
  }

  public stop(): void {
    clearInterval(this.intervalId);
  }
}
