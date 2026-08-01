import type { Job, JobStyle } from '../types'
import { ALL_JOBS } from '../types'

export { ALL_JOBS, DEFAULT_JOBS, JOB_CATEGORIES, JOBS, MAX_PLAYERS, MIN_PLAYERS } from '../types'
export type { Job }

export const JOB_STYLES: Record<Job, JobStyle> = {
  狂戰士: {
    label: '狂戰士',
    emoji: '⚔️',
    accent: '#b91c1c',
    soft: '#fde8e8',
    border: '#991b1b',
  },
  見習騎士: {
    label: '見習騎士',
    emoji: '🛡️',
    accent: '#a16207',
    soft: '#fef3c7',
    border: '#92400e',
  },
  槍騎兵: {
    label: '槍騎兵',
    emoji: '🗡️',
    accent: '#c45c26',
    soft: '#f8e4d6',
    border: '#b45309',
  },
  火毒巫師: {
    label: '火毒巫師',
    emoji: '🔥',
    accent: '#c2410c',
    soft: '#ffedd5',
    border: '#9a3412',
  },
  冰雷巫師: {
    label: '冰雷巫師',
    emoji: '❄️',
    accent: '#3b6ea8',
    soft: '#dde9f7',
    border: '#4a78b5',
  },
  僧侶: {
    label: '僧侶',
    emoji: '✨',
    accent: '#6b8f3a',
    soft: '#eaf3d8',
    border: '#7a9b45',
  },
  獵人: {
    label: '獵人',
    emoji: '🏹',
    accent: '#15803d',
    soft: '#dcfce7',
    border: '#166534',
  },
  弩弓手: {
    label: '弩弓手',
    emoji: '🎯',
    accent: '#0f766e',
    soft: '#ccfbf1',
    border: '#115e59',
  },
  刺客: {
    label: '刺客',
    emoji: '🗡️',
    accent: '#6d28d9',
    soft: '#ede9fe',
    border: '#5b21b6',
  },
  俠盜: {
    label: '俠盜',
    emoji: '🌑',
    accent: '#334155',
    soft: '#e2e8f0',
    border: '#1e293b',
  },
  打手: {
    label: '打手',
    emoji: '👊',
    accent: '#be123c',
    soft: '#ffe4e6',
    border: '#9f1239',
  },
  槍手: {
    label: '槍手',
    emoji: '🔫',
    accent: '#0369a1',
    soft: '#e0f2fe',
    border: '#075985',
  },
}

export function buildSpinFrames(
  finalJob: Job,
  reducedMotion: boolean,
  pool: readonly Job[] = ALL_JOBS,
): { job: Job; delayMs: number }[] {
  if (reducedMotion) {
    return [{ job: finalJob, delayMs: 0 }]
  }

  const spinPool = pool.length > 0 ? [...pool] : [...ALL_JOBS]
  const frames: { job: Job; delayMs: number }[] = []
  let elapsed = 0
  let delay = 55
  const targetDuration = 1700 + Math.floor(Math.random() * 250)

  while (elapsed + delay < targetDuration - 280) {
    const job = spinPool[Math.floor(Math.random() * spinPool.length)]!
    frames.push({ job, delayMs: delay })
    elapsed += delay
    delay = Math.min(delay * 1.18, 220)
  }

  const decoys = spinPool.filter((j) => j !== finalJob)
  if (decoys.length > 0) {
    frames.push({
      job: decoys[Math.floor(Math.random() * decoys.length)]!,
      delayMs: Math.round(delay),
    })
  }

  frames.push({ job: finalJob, delayMs: Math.round(delay * 1.35) })
  return frames
}

export function formatOwnResultText(name: string, job: Job): string {
  return ['新楓之谷經典服職業抽籤結果', '', `${name}：${job}`].join('\n')
}

export function formatFullResultsText(
  results: { name: string; job: Job }[],
): string {
  const lines = results.map((r) => `${r.name}：${r.job}`)
  return ['新楓之谷經典服職業抽籤結果', '', ...lines].join('\n')
}
