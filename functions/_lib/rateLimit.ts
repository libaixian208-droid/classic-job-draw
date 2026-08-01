/// <reference types="@cloudflare/workers-types" />

export function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

interface Counter {
  count: number
  resetAt: number
}

/**
 * Best-effort KV rate limit. Fail-open on KV errors so the app stays usable.
 */
export async function rateLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowSec: number,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const storageKey = `classic-job-draw:rl:${key}`
  const now = Date.now()
  try {
    const raw = await kv.get(storageKey)
    let counter: Counter = raw
      ? (JSON.parse(raw) as Counter)
      : { count: 0, resetAt: now + windowSec * 1000 }

    if (!Number.isFinite(counter.resetAt) || counter.resetAt <= now) {
      counter = { count: 0, resetAt: now + windowSec * 1000 }
    }

    if (counter.count >= limit) {
      return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((counter.resetAt - now) / 1000)),
      }
    }

    counter.count += 1
    const ttl = Math.max(60, Math.ceil((counter.resetAt - now) / 1000))
    await kv.put(storageKey, JSON.stringify(counter), { expirationTtl: ttl })
    return { ok: true }
  } catch {
    return { ok: true }
  }
}

export async function enforceRateLimit(
  request: Request,
  kv: KVNamespace,
  bucket: string,
  limit: number,
  windowSec: number,
): Promise<Response | null> {
  const ip = clientIp(request)
  const result = await rateLimit(kv, `${bucket}:${ip}`, limit, windowSec)
  if (result.ok) return null
  return new Response(
    JSON.stringify({
      ok: false,
      error: `請求過於頻繁，請約 ${result.retryAfterSec} 秒後再試`,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': String(result.retryAfterSec),
      },
    },
  )
}
