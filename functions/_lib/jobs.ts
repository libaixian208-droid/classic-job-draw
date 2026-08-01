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

/** 開房預設：原本三人組 */
export const DEFAULT_JOBS: Job[] = ['槍騎兵', '僧侶', '冰雷巫師']

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = ALL_JOBS.length

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

export function isJob(value: unknown): value is Job {
  return typeof value === 'string' && (ALL_JOBS as readonly string[]).includes(value)
}

export function normalizeJobList(raw: unknown): Job[] | null {
  if (!Array.isArray(raw) || raw.length < MIN_PLAYERS || raw.length > MAX_PLAYERS) {
    return null
  }
  const jobs: Job[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    if (!isJob(item) || seen.has(item)) return null
    seen.add(item)
    jobs.push(item)
  }
  return jobs
}
