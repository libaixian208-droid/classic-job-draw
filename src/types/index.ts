/** 新楓之谷：經典版 — 冒險家十二種二轉分支 */
export const ALL_JOBS = [
  '狂戰士',
  '見習騎士',
  '槍騎兵',
  '火毒巫師',
  '冰雷巫師',
  '僧侶',
  '獵人',
  '弩弓手',
  '刺客',
  '俠盜',
  '打手',
  '槍手',
] as const

export type Job = (typeof ALL_JOBS)[number]

/** @deprecated use ALL_JOBS — kept as alias for spin pool default */
export const JOBS = ALL_JOBS

export const DEFAULT_JOBS: Job[] = ['槍騎兵', '僧侶', '冰雷巫師']

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = ALL_JOBS.length

export type PlayerId = number

export interface JobStyle {
  emoji: string
  label: Job
  accent: string
  soft: string
  border: string
}

export interface JobCategory {
  id: string
  label: string
  jobs: Job[]
}

export const JOB_CATEGORIES: JobCategory[] = [
  { id: 'warrior', label: '劍士', jobs: ['狂戰士', '見習騎士', '槍騎兵'] },
  { id: 'mage', label: '法師', jobs: ['火毒巫師', '冰雷巫師', '僧侶'] },
  { id: 'bowman', label: '弓箭手', jobs: ['獵人', '弩弓手'] },
  { id: 'thief', label: '盜賊', jobs: ['刺客', '俠盜'] },
  { id: 'pirate', label: '海盜', jobs: ['打手', '槍手'] },
]

export interface PublicPlayer {
  id: PlayerId
  name: string
  hasDrawn: boolean
  job: Job | null
  isHost: boolean
}

export interface RevealedResult {
  id: PlayerId
  name: string
  job: Job
}

export interface PublicSession {
  roomCode: string
  registeredCount: number
  maxPlayers: number
  drawnCount: number
  allDone: boolean
  selectedJobs: Job[]
  players: PublicPlayer[]
  results: RevealedResult[] | null
  updatedAt: string
  expiresInDays: number
}

export interface PrivatePlayer {
  id: PlayerId
  name: string
  job: Job | null
  isHost: boolean
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

export interface CreateRoomResponse {
  ok: true
  roomCode: string
  session: PublicSession
}

export interface ApiError {
  ok: false
  error: string
}
