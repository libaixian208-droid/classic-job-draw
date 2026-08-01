export const JOBS = ['槍騎兵', '僧侶', '冰雷巫師'] as const

export type Job = (typeof JOBS)[number]

export type PlayerId = 0 | 1 | 2

export interface StoredPlayer {
  id: PlayerId
  name: string
  nameKey: string
  job: Job | null
  token: string
}

export interface SessionState {
  version: 1
  players: StoredPlayer[]
  remainingJobs: Job[]
  updatedAt: string
}

/** Public roster entry — never includes job. */
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

export interface PrivatePlayerView {
  id: PlayerId
  name: string
  job: Job | null
}

export function createEmptySession(): SessionState {
  return {
    version: 1,
    players: [],
    remainingJobs: [...JOBS],
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
  return {
    registeredCount: session.players.length,
    maxPlayers: 3,
    drawnCount: session.players.filter((p) => p.job !== null).length,
    allDone:
      session.players.length === 3 &&
      session.players.every((p) => p.job !== null),
    players: session.players.map((p) => ({
      id: p.id,
      name: p.name,
      hasDrawn: p.job !== null,
    })),
  }
}

export function toPrivatePlayer(player: StoredPlayer): PrivatePlayerView {
  return {
    id: player.id,
    name: player.name,
    job: player.job,
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

export function isJob(value: unknown): value is Job {
  return typeof value === 'string' && (JOBS as readonly string[]).includes(value)
}

export function isValidSession(value: unknown): value is SessionState {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  if (s.version !== 1) return false
  if (!Array.isArray(s.players) || s.players.length > 3) return false
  if (!Array.isArray(s.remainingJobs)) return false
  if (!s.remainingJobs.every(isJob)) return false
  if (typeof s.updatedAt !== 'string') return false

  const players = s.players as StoredPlayer[]
  for (const p of players) {
    if (
      (p.id !== 0 && p.id !== 1 && p.id !== 2) ||
      typeof p.name !== 'string' ||
      typeof p.nameKey !== 'string' ||
      typeof p.token !== 'string' ||
      !(p.job === null || isJob(p.job))
    ) {
      return false
    }
  }

  const assigned = players
    .map((p) => p.job)
    .filter((j): j is Job => j !== null)
  if (new Set(assigned).size !== assigned.length) return false
  if (assigned.some((j) => (s.remainingJobs as Job[]).includes(j))) return false

  return true
}
