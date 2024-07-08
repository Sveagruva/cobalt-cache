

# cobalt-cache by Sveagruva

`cobalt-cache` is a TypeScript class for managing in-memory caching with expiration based on time-to-live (TTL). It supports three cleanup modes: interval, timeout and immediate.

## Features

- Set and get cached values with TTL.
- Delete specific keys from the cache.
- Check if a key exists in the cache.
- Clear all keys from the cache.
- Stop the automatic cleanup process.

### Modes
- interval: Cleanup is done by a setInterval, cleans up expired keys all at once.
- timeout: Cleanup is done by a setTimeout, cleans up expired keys one by one.
- immediate: Cleanup is done on demand only or when a new value is set.

## Installation

   ```bash
    npm install cobalt-cache
    yarn add cobalt-cache
    pnpm install cobalt-cache
   ```

## Usage

### Importing the `MemoryCache` class

```typescript
import { MemoryCache, CacheConfig } from 'cobalt-cache';
```

### Example Usage

```typescript
// Create a MemoryCache instance
const config: CacheConfig = {
  ttl: 5000, // TTL in milliseconds
  cleanupMode: 'interval', // or 'timeout'
  interval: 1000, // only for interval cleanup mode
};

const cache = new MemoryCache(config);

// Set a value with key 'key1'
cache.set('key1', 'value1');

// Get a value by key
const value = cache.get('key1');
console.log(value); // Output: 'value1'

// Delete a key from the cache
cache.delete('key1');

// Check if a key exists in the cache
const exists = cache.has('key1');
console.log(exists); // Output: false

// Clear all keys from the cache
cache.clear();

// stop the cleanup process
cache.stop();

```

## Running Tests

Run tests using the following command:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

