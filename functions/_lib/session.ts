import {
  ALL_JOBS,
  DEFAULT_JOBS,
  isJob,
  MAX_PLAYERS,
  MIN_PLAYERS,
  normalizeJobList,
  type Job,
} from './jobs'

export type { Job }
export {
  ALL_JOBS,
  DEFAULT_JOBS,
  isJob,
  MAX_PLAYERS,
  MIN_PLAYERS,
  normalizeJobList,
}

export type PlayerId = number

export interface StoredPlayer {
  id: PlayerId
  name: string
  nameKey: string
  job: Job | null
  token: string
  /** SHA-256 hex of seat passcode; absent on legacy seats. */
  passcodeHash?: string
}

export interface SessionState {
  version: 3
  roomCode: string
  hostPlayerId: PlayerId | null
  revision: number
  maxPlayers: number
  selectedJobs: Job[]
  players: StoredPlayer[]
  remainingJobs: Job[]
  updatedAt: string
}

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
  /** Days until idle KV expiry (refreshed on each write). */
  expiresInDays: number
}

export interface PrivatePlayerView {
  id: PlayerId
  name: string
  job: Job | null
  isHost: boolean
}

const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const ROOM_TTL_DAYS = 14

export function generateRoomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let code = ''
  for (const b of bytes) {
    code += ROOM_ALPHABET[b % ROOM_ALPHABET.length]!
  }
  return code
}

export function normalizeRoomCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code)
}

export function createEmptySession(
  roomCode: string,
  selectedJobs: Job[] = [...DEFAULT_JOBS],
): SessionState {
  const jobs = [...selectedJobs]
  return {
    version: 3,
    roomCode,
    hostPlayerId: null,
    revision: 0,
    maxPlayers: jobs.length,
    selectedJobs: jobs,
    players: [],
    remainingJobs: [...jobs],
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

export function nameKey(name: string): string {
  return normalizeName(name).toLowerCase()
}

export function toPublicSession(session: SessionState): PublicSession {
  const allDone =
    session.players.length === session.maxPlayers &&
    session.players.length > 0 &&
    session.players.every((p) => p.job !== null)

  const updatedMs = Date.parse(session.updatedAt)
  const ageDays = Number.isFinite(updatedMs)
    ? (Date.now() - updatedMs) / (1000 * 60 * 60 * 24)
    : 0
  const expiresInDays = Math.max(0, Math.ceil(ROOM_TTL_DAYS - ageDays))

  return {
    roomCode: session.roomCode,
    registeredCount: session.players.length,
    maxPlayers: session.maxPlayers,
    drawnCount: session.players.filter((p) => p.job !== null).length,
    allDone,
    selectedJobs: [...session.selectedJobs],
    players: session.players.map((p) => ({
      id: p.id,
      name: p.name,
      hasDrawn: p.job !== null,
      job: allDone ? p.job : null,
      isHost: session.hostPlayerId === p.id,
    })),
    results: allDone
      ? session.players.map((p) => ({
          id: p.id,
          name: p.name,
          job: p.job as Job,
        }))
      : null,
    updatedAt: session.updatedAt,
    expiresInDays,
  }
}

export function toPrivatePlayer(
  player: StoredPlayer,
  session: SessionState,
): PrivatePlayerView {
  return {
    id: player.id,
    name: player.name,
    job: player.job,
    isHost: session.hostPlayerId === player.id,
  }
}

export function pickRandomJob(remainingJobs: readonly Job[]): {
  job: Job
  nextRemaining: Job[]
} {
  if (remainingJobs.length === 0) {
    throw new Error('沒有剩餘職業可供抽籤')
  }
  const index = Math.floor(Math.random() * remainingJobs.length)
  const job = remainingJobs[index]
  if (job === undefined) {
    throw new Error('抽籤索引無效')
  }
  return {
    job,
    nextRemaining: remainingJobs.filter((_, i) => i !== index),
  }
}

export function isValidSession(value: unknown): value is SessionState {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  if (s.version !== 3) return false
  if (typeof s.roomCode !== 'string' || !isValidRoomCode(s.roomCode)) return false
  if (!(s.hostPlayerId === null || typeof s.hostPlayerId === 'number')) return false
  if (typeof s.revision !== 'number') return false
  if (typeof s.maxPlayers !== 'number') return false
  if (!Array.isArray(s.selectedJobs)) return false
  if (!Array.isArray(s.players) || s.players.length > s.maxPlayers) return false
  if (!Array.isArray(s.remainingJobs)) return false
  if (typeof s.updatedAt !== 'string') return false

  const selected = normalizeJobList(s.selectedJobs)
  if (!selected || selected.length !== s.maxPlayers) return false
  if (!s.remainingJobs.every(isJob)) return false

  const players = s.players as StoredPlayer[]
  for (const p of players) {
    if (
      typeof p.id !== 'number' ||
      p.id < 0 ||
      p.id >= (s.maxPlayers as number) ||
      typeof p.name !== 'string' ||
      typeof p.nameKey !== 'string' ||
      typeof p.token !== 'string' ||
      !(p.job === null || isJob(p.job)) ||
      (p.passcodeHash !== undefined && typeof p.passcodeHash !== 'string')
    ) {
      return false
    }
  }

  const assigned = players
    .map((p) => p.job)
    .filter((j): j is Job => j !== null)
  if (new Set(assigned).size !== assigned.length) return false
  if (assigned.some((j) => !(s.selectedJobs as Job[]).includes(j))) return false
  if (assigned.some((j) => (s.remainingJobs as Job[]).includes(j))) return false

  const remaining = s.remainingJobs as Job[]
  if (remaining.some((j) => !(s.selectedJobs as Job[]).includes(j))) return false
  if (assigned.length + remaining.length !== selected.length) return false

  return true
}

export function roomStorageKey(roomCode: string): string {
  return `classic-job-draw:room:${roomCode}:v3`
}

export function roomLockKey(roomCode: string): string {
  return `classic-job-draw:room:${roomCode}:lock`
}
