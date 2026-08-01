import type { Job, JobStyle } from '../types'
import { JOBS } from '../types'

export { JOBS }

export const JOB_STYLES: Record<Job, JobStyle> = {
  槍騎兵: {
    label: '槍騎兵',
    emoji: '🛡️',
    accent: '#c45c26',
    soft: '#f8e4d6',
    border: '#b45309',
  },
  僧侶: {
    label: '僧侶',
    emoji: '✨',
    accent: '#6b8f3a',
    soft: '#eaf3d8',
    border: '#7a9b45',
  },
  冰雷巫師: {
    label: '冰雷巫師',
    emoji: '❄️',
    accent: '#3b6ea8',
    soft: '#dde9f7',
    border: '#4a78b5',
  },
}

/** Pick one job uniformly from the remaining pool (does not mutate input). */
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

  const nextRemaining = remainingJobs.filter((_, i) => i !== index)
  return { job, nextRemaining }
}

/**
 * Build a spin timeline that ends on `finalJob`.
 * Total duration is roughly 1.6–1.9s unless reduced motion is preferred.
 */
export function buildSpinFrames(
  finalJob: Job,
  reducedMotion: boolean,
): { job: Job; delayMs: number }[] {
  if (reducedMotion) {
    return [{ job: finalJob, delayMs: 0 }]
  }

  const pool = [...JOBS]
  const frames: { job: Job; delayMs: number }[] = []
  let elapsed = 0
  let delay = 55
  const targetDuration = 1700 + Math.floor(Math.random() * 250)

  while (elapsed + delay < targetDuration - 280) {
    const job = pool[Math.floor(Math.random() * pool.length)]!
    frames.push({ job, delayMs: delay })
    elapsed += delay
    delay = Math.min(delay * 1.18, 220)
  }

  // Ensure the last few frames lead into the real result.
  const decoys = pool.filter((j) => j !== finalJob)
  if (decoys.length > 0) {
    frames.push({
      job: decoys[Math.floor(Math.random() * decoys.length)]!,
      delayMs: Math.round(delay),
    })
  }

  frames.push({ job: finalJob, delayMs: Math.round(delay * 1.35) })
  return frames
}

export function formatShareText(
  players: { name: string; job: Job }[],
): string {
  const lines = players.map((p) => `${p.name}：${p.job}`)
  return ['新楓之谷經典服職業抽籤結果', '', ...lines].join('\n')
}

export function displayName(name: string, fallbackIndex: number): string {
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : `玩家 ${fallbackIndex + 1}`
}
