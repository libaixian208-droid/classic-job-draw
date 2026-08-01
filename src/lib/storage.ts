const STORAGE_KEY = 'classic-job-draw:auth:v3'
const LEGACY_KEYS = [
  'classic-job-draw:auth:v2',
  'classic-job-draw:auth:v1',
]

export interface AuthSession {
  version: 3
  roomCode: string
  token: string
  name: string
}

function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code)
}

export function loadAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        localStorage.removeItem(key)
      }
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as AuthSession).version !== 3 ||
      typeof (parsed as AuthSession).token !== 'string' ||
      typeof (parsed as AuthSession).name !== 'string' ||
      typeof (parsed as AuthSession).roomCode !== 'string' ||
      !isValidRoomCode((parsed as AuthSession).roomCode)
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed as AuthSession
  } catch {
    return null
  }
}

export function saveAuth(roomCode: string, token: string, name: string): void {
  const payload: AuthSession = {
    version: 3,
    roomCode,
    token,
    name,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function readRoomFromUrl(): string | null {
  try {
    const code = new URLSearchParams(window.location.search)
      .get('room')
      ?.trim()
      .toUpperCase()
    if (code && isValidRoomCode(code)) return code
  } catch {
    /* ignore */
  }
  return null
}

export function readWatchFromUrl(): boolean {
  try {
    const v = new URLSearchParams(window.location.search).get('watch')
    return v === '1' || v === 'true'
  } catch {
    return false
  }
}

export function writeRoomToUrl(roomCode: string, watch = false): void {
  const url = new URL(window.location.href)
  url.searchParams.set('room', roomCode)
  if (watch) url.searchParams.set('watch', '1')
  else url.searchParams.delete('watch')
  window.history.replaceState({}, '', url.toString())
}

export function clearRoomFromUrl(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('room')
  url.searchParams.delete('watch')
  window.history.replaceState({}, '', url.toString())
}
