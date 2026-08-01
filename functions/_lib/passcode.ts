/** 4–8 digit room seat passcode (not a full account password). */

export function normalizePasscode(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw.replace(/\D/g, '').slice(0, 8)
}

export function isValidPasscode(pin: string): boolean {
  return /^\d{4,8}$/.test(pin)
}

export async function hashPasscode(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`classic-job-draw:v1:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPasscode(
  pin: string,
  hash: string | undefined,
): Promise<'ok' | 'mismatch' | 'set'> {
  if (!isValidPasscode(pin)) return 'mismatch'
  if (!hash) return 'set'
  const next = await hashPasscode(pin)
  return next === hash ? 'ok' : 'mismatch'
}
