import type {
  ApiError,
  AuthResponse,
  MeResponse,
  SessionResponse,
} from '../types'

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ApiError
  if (!res.ok || (typeof data === 'object' && data && 'ok' in data && data.ok === false)) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as ApiError).error)
        : '請求失敗'
    throw new Error(message)
  }
  return data as T
}

export async function fetchSession(): Promise<SessionResponse> {
  const res = await fetch('/api/session')
  return parse<SessionResponse>(res)
}

export async function register(name: string): Promise<AuthResponse> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return parse<AuthResponse>(res)
}

export async function login(name: string): Promise<AuthResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return parse<AuthResponse>(res)
}

export async function fetchMe(token: string): Promise<MeResponse> {
  const res = await fetch('/api/me', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return parse<MeResponse>(res)
}

export async function draw(token: string): Promise<MeResponse> {
  const res = await fetch('/api/draw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return parse<MeResponse>(res)
}

export async function resetRound(token: string): Promise<MeResponse> {
  const res = await fetch('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return parse<MeResponse>(res)
}
