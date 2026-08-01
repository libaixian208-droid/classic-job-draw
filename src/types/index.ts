export const JOBS = ['槍騎兵', '僧侶', '冰雷巫師'] as const

export type Job = (typeof JOBS)[number]

export type PlayerId = 0 | 1 | 2

export interface JobStyle {
  emoji: string
  label: Job
  accent: string
  soft: string
  border: string
}

export interface PublicPlayer {
  id: PlayerId
  name: string
  hasDrawn: boolean
}

export interface PublicSession {
  registeredCount: number
  maxPlayers: number
  drawnCount: number
  allDone: boolean
  players: PublicPlayer[]
}

export interface PrivatePlayer {
  id: PlayerId
  name: string
  job: Job | null
}

export interface AuthResponse {
  ok: true
  token: string
  me: PrivatePlayer
  session: PublicSession
}

export interface MeResponse {
  ok: true
  me: PrivatePlayer
  session: PublicSession
}

export interface SessionResponse {
  ok: true
  session: PublicSession
}

export interface ApiError {
  ok: false
  error: string
}
