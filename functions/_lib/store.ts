/// <reference types="@cloudflare/workers-types" />

import {
  createEmptySession,
  isValidSession,
  type SessionState,
} from './session'

export const SESSION_KEY = 'classic-job-draw:session:v1'

export interface Env {
  DRAW_KV: KVNamespace
}

export async function loadSession(kv: KVNamespace): Promise<SessionState> {
  const raw = await kv.get(SESSION_KEY)
  if (!raw) return createEmptySession()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isValidSession(parsed)) return createEmptySession()
    return parsed
  } catch {
    return createEmptySession()
  }
}

export async function saveSession(
  kv: KVNamespace,
  session: SessionState,
): Promise<void> {
  session.updatedAt = new Date().toISOString()
  await kv.put(SESSION_KEY, JSON.stringify(session))
}
