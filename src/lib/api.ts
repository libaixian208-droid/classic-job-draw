import type {
  ApiError,
  AuthResponse,
  CreateRoomResponse,
  MeResponse,
  SessionResponse,
} from '../types'

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function parse<T>(res: Response): Promise<T> {
  let data: T | ApiError
  try {
    data = (await res.json()) as T | ApiError
  } catch {
    throw new Error(
      res.status >= 500
        ? '伺服器忙碌或離線，請稍後再試'
        : '回應格式錯誤，請稍後再試',
    )
  }
  if (
    !res.ok ||
    (typeof data === 'object' && data && 'ok' in data && data.ok === false)
  ) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as ApiError).error)
        : res.status >= 500
          ? '伺服器忙碌或離線，請稍後再試'
          : '請求失敗'
    throw new Error(message)
  }
  return data as T
}

async function requestJson<T>(
  input: string,
  init?: RequestInit,
  retries = 2,
): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init)
      if (res.status >= 500 && attempt < retries) {
        await sleep(300 * (attempt + 1))
        continue
      }
      return await parse<T>(res)
    } catch (e) {
      lastError = e instanceof Error ? e : new Error('網路錯誤')
      const retryable =
        lastError.message.includes('離線') ||
        lastError.message.includes('Failed to fetch') ||
        lastError.message.includes('NetworkError') ||
        lastError.message.includes('伺服器忙碌')
      if (!retryable || attempt >= retries) break
      await sleep(300 * (attempt + 1))
    }
  }
  throw lastError ?? new Error('網路連線失敗，請檢查網路後再試')
}

export async function createRoom(jobs: string[]): Promise<CreateRoomResponse> {
  return requestJson<CreateRoomResponse>('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs }),
  })
}

export async function fetchSession(room: string): Promise<SessionResponse> {
  return requestJson<SessionResponse>(
    `/api/session?room=${encodeURIComponent(room)}`,
  )
}

export async function register(
  room: string,
  name: string,
): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, name }),
  })
}

export async function login(room: string, name: string): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, name }),
  })
}

export async function fetchMe(
  room: string,
  token: string,
): Promise<MeResponse> {
  return requestJson<MeResponse>('/api/me', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, token }),
  })
}

export async function draw(room: string, token: string): Promise<MeResponse> {
  return requestJson<MeResponse>('/api/draw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, token }),
  })
}

export async function resetRound(
  room: string,
  token: string,
): Promise<MeResponse> {
  return requestJson<MeResponse>('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, token }),
  })
}

export async function updateJobs(
  room: string,
  token: string,
  jobs: string[],
): Promise<MeResponse> {
  return requestJson<MeResponse>('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, token, jobs }),
  })
}

export async function kickPlayer(
  room: string,
  token: string,
  playerId: number,
): Promise<MeResponse> {
  return requestJson<MeResponse>('/api/kick', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, token, playerId }),
  })
}
