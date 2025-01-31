class NodeCache {
  private cache: Map<string, { data: any; expiry: number }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: any, ttlSeconds: number) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data: value, expiry });
  }

  get(key: string) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    if (Date.now() > cachedItem.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  del(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new NodeCache();
export default cache;
