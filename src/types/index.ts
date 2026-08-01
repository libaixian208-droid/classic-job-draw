export const JOBS = ['槍騎兵', '僧侶', '冰雷巫師'] as const

export type Job = (typeof JOBS)[number]

export type PlayerId = 0 | 1 | 2

export interface Player {
  id: PlayerId
  name: string
  job: Job | null
}

export interface PersistedState {
  version: 1
  players: Player[]
  remainingJobs: Job[]
}

export interface JobStyle {
  emoji: string
  label: Job
  accent: string
  soft: string
  border: string
}
