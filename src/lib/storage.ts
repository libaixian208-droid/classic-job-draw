import type { Job, PersistedState, Player, PlayerId } from '../types'
import { JOBS } from '../types'

export const STORAGE_KEY = 'classic-job-draw:v1'
export const STORAGE_VERSION = 1 as const

export function createInitialPlayers(): Player[] {
  return [
    { id: 0, name: '', job: null },
    { id: 1, name: '', job: null },
    { id: 2, name: '', job: null },
  ]
}

export function createInitialState(): PersistedState {
  return {
    version: STORAGE_VERSION,
    players: createInitialPlayers(),
    remainingJobs: [...JOBS],
  }
}

function isJob(value: unknown): value is Job {
  return typeof value === 'string' && (JOBS as readonly string[]).includes(value)
}

function isPlayerId(value: unknown): value is PlayerId {
  return value === 0 || value === 1 || value === 2
}

function isPlayer(value: unknown): value is Player {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    isPlayerId(p.id) &&
    typeof p.name === 'string' &&
    (p.job === null || isJob(p.job))
  )
}

function isValidState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  if (s.version !== STORAGE_VERSION) return false
  if (!Array.isArray(s.players) || s.players.length !== 3) return false
  if (!s.players.every(isPlayer)) return false
  if (!Array.isArray(s.remainingJobs)) return false
  if (!s.remainingJobs.every(isJob)) return false

  const players = s.players as Player[]
  const remaining = s.remainingJobs as Job[]
  const assigned = players
    .map((p) => p.job)
    .filter((j): j is Job => j !== null)

  // Assigned jobs must be unique and not appear in remaining pool.
  if (new Set(assigned).size !== assigned.length) return false
  if (assigned.some((j) => remaining.includes(j))) return false

  // Every job must be either assigned or remaining.
  const all = [...assigned, ...remaining]
  if (all.length !== JOBS.length) return false
  if (new Set(all).size !== JOBS.length) return false
  if (!JOBS.every((j) => all.includes(j))) return false

  // Player ids must be 0,1,2 uniquely.
  const ids = players.map((p) => p.id)
  if (new Set(ids).size !== 3) return false

  return true
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed: unknown = JSON.parse(raw)
    if (!isValidState(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      return createInitialState()
    }
    // Normalize player order by id.
    const ordered = [...parsed.players].sort((a, b) => a.id - b.id)
    return { ...parsed, players: ordered }
  } catch {
    return createInitialState()
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota / private mode failures; app still works in-memory.
  }
}
