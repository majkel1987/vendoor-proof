export type RateLimitResult = {
  success: boolean;
  remaining: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export async function checkRateLimit({
  key,
  limit,
  windowMs
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return {
      success: true,
      remaining: limit - 1
    };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0
    };
  }

  bucket.count += 1;

  return {
    success: true,
    remaining: Math.max(0, limit - bucket.count)
  };
}
