const STORAGE_KEY = 'classic-job-draw:auth:v2'

export interface AuthSession {
  version: 2
  token: string
  name: string
}

export function loadAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as AuthSession).version !== 2 ||
      typeof (parsed as AuthSession).token !== 'string' ||
      typeof (parsed as AuthSession).name !== 'string'
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed as AuthSession
  } catch {
    return null
  }
}

export function saveAuth(token: string, name: string): void {
  const payload: AuthSession = { version: 2, token, name }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}
