import { Redis } from "@upstash/redis";

let cachedRedis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!cachedRedis) {
    cachedRedis = new Redis({ url, token });
  }
  return cachedRedis;
}

export type DedupeResult =
  | { ok: true; shouldProcess: true }
  | { ok: true; shouldProcess: false }
  | { ok: false; reason: string };

export async function dedupeStripeEvent(
  eventId: string,
  ttlSeconds: number,
): Promise<DedupeResult> {
  const redis = getRedis();
  if (!redis) {
    return {
      ok: false,
      reason: "Missing UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN",
    };
  }

  const key = `stripe:event:${eventId}`;

  // SET key value NX EX ttl
  const setResult = await redis.set(key, "1", {
    nx: true,
    ex: ttlSeconds,
  });

  // Upstash returns "OK" when set, otherwise null when NX fails.
  return { ok: true, shouldProcess: setResult === "OK" };
}

