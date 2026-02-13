// In-memory LRU Response Cache for premium model cost optimization
// Caches responses keyed by hash of (prompt + backendModel + conversationContext)
// TTL: 5 minutes, Max entries: 50

export interface CacheEntry {
  response: string;
  citations?: string[];
  timestamp: number;
  inputTokens: number;
  outputTokens: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 50;

const cache = new Map<string, CacheEntry>();
const accessOrder: string[] = []; // Track insertion order for LRU eviction

/**
 * Simple string hash (djb2 algorithm)
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash.toString(36);
}

/**
 * Generate a context-aware cache key
 * Includes last 3 conversation messages to prevent stale context hits
 */
export function generateCacheKey(
  prompt: string,
  backendModelId: string,
  conversationHistory?: { role: string; content: string }[]
): string {
  const contextHash = conversationHistory
    ? conversationHistory
        .slice(-3)
        .map(m => `${m.role}:${m.content.slice(0, 100)}`)
        .join('|')
    : '';
  return simpleHash(`${prompt}|${backendModelId}|${contextHash}`);
}

/**
 * Get a cached response if available and not expired
 */
export function getCachedResponse(key: string): CacheEntry | null {
  const entry = cache.get(key);
  if (!entry) return null;

  // Check TTL
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    const idx = accessOrder.indexOf(key);
    if (idx !== -1) accessOrder.splice(idx, 1);
    return null;
  }

  return entry;
}

/**
 * Store a response in the cache
 */
export function setCachedResponse(key: string, entry: Omit<CacheEntry, 'timestamp'>): void {
  // Evict oldest if at capacity
  while (cache.size >= MAX_ENTRIES && accessOrder.length > 0) {
    const oldestKey = accessOrder.shift()!;
    cache.delete(oldestKey);
  }

  cache.set(key, { ...entry, timestamp: Date.now() });
  accessOrder.push(key);
}

/**
 * Clear the entire cache
 */
export function clearCache(): void {
  cache.clear();
  accessOrder.length = 0;
}

/**
 * Simulate streaming for cached responses (~50 chars per frame for natural feel)
 */
export function simulateCachedStreaming(
  response: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): void {
  const CHARS_PER_FRAME = 50;
  let pos = 0;

  const tick = () => {
    if (pos >= response.length) {
      onComplete();
      return;
    }
    const end = Math.min(pos + CHARS_PER_FRAME, response.length);
    onChunk(response.slice(pos, end));
    pos = end;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
