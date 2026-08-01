/// <reference types="@cloudflare/workers-types" />

import {
  createEmptySession,
  generateRoomCode,
  isValidRoomCode,
  isValidSession,
  normalizeRoomCode,
  roomLockKey,
  roomStorageKey,
  type Job,
  type SessionState,
} from './session'

export interface Env {
  DRAW_KV: KVNamespace
}

export type MutateOutcome =
  | { ok: true; session: SessionState }
  | { ok: false; error: string; status: number }

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function loadRoom(
  kv: KVNamespace,
  roomCode: string,
): Promise<SessionState | null> {
  const code = normalizeRoomCode(roomCode)
  if (!isValidRoomCode(code)) return null
  const raw = await kv.get(roomStorageKey(code))
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isValidSession(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export async function saveRoom(
  kv: KVNamespace,
  session: SessionState,
): Promise<void> {
  session.updatedAt = new Date().toISOString()
  session.revision += 1
  await kv.put(roomStorageKey(session.roomCode), JSON.stringify(session), {
    expirationTtl: 60 * 60 * 24 * 14, // keep in sync with ROOM_TTL_DAYS
  })
}

async function tryLock(kv: KVNamespace, roomCode: string): Promise<boolean> {
  const key = roomLockKey(roomCode)
  const existing = await kv.get(key)
  if (existing) return false
  // Cloudflare KV minimum expirationTtl is 60 seconds.
  await kv.put(key, String(Date.now()), { expirationTtl: 60 })
  return true
}

async function unlock(kv: KVNamespace, roomCode: string): Promise<void> {
  try {
    await kv.delete(roomLockKey(roomCode))
  } catch {
    /* ignore */
  }
}

/** Best-effort locked read-modify-write with retries (KV has no true CAS). */
export async function mutateRoom(
  kv: KVNamespace,
  roomCode: string,
  mutator: (session: SessionState) => MutateOutcome,
): Promise<MutateOutcome> {
  const code = normalizeRoomCode(roomCode)
  if (!isValidRoomCode(code)) {
    return { ok: false, error: '房間代碼無效', status: 400 }
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const locked = await tryLock(kv, code)
    if (!locked) {
      await sleep(30 + attempt * 40)
      continue
    }

    try {
      const current = await loadRoom(kv, code)
      if (!current) {
        return { ok: false, error: '找不到這個房間', status: 404 }
      }
      const beforeRevision = current.revision
      const result = mutator(structuredClone(current))
      if (!result.ok) return result

      // Re-check nobody else wrote while we held the lock.
      const latest = await loadRoom(kv, code)
      if (!latest || latest.revision !== beforeRevision) {
        await sleep(20 + attempt * 30)
        continue
      }

      await saveRoom(kv, result.session)
      return { ok: true, session: result.session }
    } finally {
      await unlock(kv, code)
    }
  }

  return {
    ok: false,
    error: '伺服器忙碌中，請再試一次',
    status: 409,
  }
}

export async function createRoom(
  kv: KVNamespace,
  selectedJobs: Job[],
): Promise<SessionState> {
  for (let i = 0; i < 8; i++) {
    const code = generateRoomCode()
    const lockKey = roomLockKey(code)
    const existingLock = await kv.get(lockKey)
    if (existingLock) continue
    await kv.put(lockKey, String(Date.now()), { expirationTtl: 60 })
    try {
      const existing = await loadRoom(kv, code)
      if (existing) continue
      const session = createEmptySession(code, selectedJobs)
      await saveRoom(kv, session)
      return session
    } finally {
      try {
        await kv.delete(lockKey)
      } catch {
        /* ignore */
      }
    }
  }
  throw new Error('無法建立房間，請稍後再試')
}
