import { useEffect, useId, useState } from 'react'
import { JOB_STYLES } from '../lib/jobs'
import {
  bracketStatus,
  clampPlayerLevel,
  findCurrentLevelingIndex,
  formatSkillGuideText,
  getSkillGuide,
  SERVER_RULES,
  stageBracketStatus,
  type SkillGuide,
} from '../lib/skillGuides'
import { playClick } from '../lib/sfx'
import type { Job } from '../types'
import { MustQuestPanel } from './MustQuestPanel'

const LEVEL_STORAGE_KEY = 'classic-job-draw:player-level:v1'

function loadStoredLevel(): string {
  try {
    const raw = localStorage.getItem(LEVEL_STORAGE_KEY)
    if (!raw) return ''
    const n = clampPlayerLevel(raw)
    return n ? String(n) : ''
  } catch {
    return ''
  }
}

function saveStoredLevel(value: string): void {
  try {
    const n = clampPlayerLevel(value)
    if (n === null) localStorage.removeItem(LEVEL_STORAGE_KEY)
    else localStorage.setItem(LEVEL_STORAGE_KEY, String(n))
  } catch {
    /* ignore */
  }
}

interface SkillGuidePanelProps {
  job: Job
  defaultOpen?: boolean
  showServerRules?: boolean
  currentLevel: number | null
  onlyCurrentLevel?: boolean
}

function statusLabel(status: string): string | null {
  if (status === 'current') return '目前'
  if (status === 'past') return '已過'
  if (status === 'future') return '之後'
  return null
}

function GuideBody({
  guide,
  showServerRules,
  currentLevel,
  onlyCurrentLevel,
}: {
  guide: SkillGuide
  showServerRules: boolean
  currentLevel: number | null
  onlyCurrentLevel: boolean
}) {
  const style = JOB_STYLES[guide.job]
  const focusRoute = findCurrentLevelingIndex(guide.leveling, currentLevel)
  const visibleStages = onlyCurrentLevel
    ? guide.stages.filter(
        (stage) => stageBracketStatus(stage.title, currentLevel) === 'current',
      )
    : guide.stages
  const visibleRoutes = onlyCurrentLevel
    ? guide.leveling.filter((_, index) => index === focusRoute)
    : guide.leveling

  return (
    <div className="skill-guide__body">
      <p className="skill-guide__meta">
        <span style={{ color: style.accent }}>{guide.path}</span>
      </p>
      <p className="skill-guide__role">{guide.role}</p>
      <p className="skill-guide__badge-row">
        <span className="skill-guide__pill">Lv.100 上限</span>
        <span className="skill-guide__pill">最高二轉</span>
        {currentLevel ? (
          <span className="skill-guide__pill skill-guide__pill--level">
            你：Lv.{currentLevel}
          </span>
        ) : null}
        {onlyCurrentLevel ? (
          <span className="skill-guide__pill">僅目前等級</span>
        ) : null}
      </p>

      {showServerRules && !onlyCurrentLevel ? (
        <div className="skill-guide__stage skill-guide__stage--rules">
          <h4 className="skill-guide__stage-title">{SERVER_RULES.title}</h4>
          <ul className="skill-guide__bullets">
            {SERVER_RULES.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!onlyCurrentLevel ? (
        <>
          <div className="skill-guide__stage">
            <h4 className="skill-guide__stage-title">能力值配點</h4>
            {guide.statBuilds.map((build) => (
              <div key={build.name} className="skill-guide__build">
                <p className="skill-guide__build-name">{build.name}</p>
                <p className="skill-guide__stage-summary">{build.summary}</p>
                <ul className="skill-guide__bullets">
                  {build.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="skill-guide__stage">
            <h4 className="skill-guide__stage-title">裝備與門檻</h4>
            <ul className="skill-guide__gear">
              {guide.gearNotes.map((g) => (
                <li key={g.label}>
                  <strong>{g.label}</strong>
                  <span>{g.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      {visibleStages.length === 0 && onlyCurrentLevel ? (
        <p className="skill-guide__now skill-guide__now--muted">
          目前等級沒有對應的加點階段標示；可關閉「僅目前等級」看完整攻略。
        </p>
      ) : null}

      {visibleStages.map((stage) => {
        const status = stageBracketStatus(stage.title, currentLevel)
        const label = statusLabel(status)
        return (
          <div
            key={stage.title}
            className={`skill-guide__stage skill-guide__stage--${status}`}
          >
            <h4 className="skill-guide__stage-title">
              {stage.title}
              {label ? (
                <span className={`skill-guide__tag skill-guide__tag--${status}`}>
                  {label}
                </span>
              ) : null}
            </h4>
            <p className="skill-guide__recipe">
              <span className="skill-guide__recipe-label">配方</span>
              {stage.summary}
            </p>
            <ol className="skill-guide__list">
              {stage.priorities.map((p, index) => (
                <li key={`${stage.title}-${index}-${p.skill}-${p.points}`}>
                  <span className="skill-guide__step" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="skill-guide__skill">{p.skill}</span>
                  <span className="skill-guide__points">{p.points}</span>
                  {p.note ? (
                    <span className="skill-guide__note">{p.note}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        )
      })}

      <div className="skill-guide__stage">
        <h4 className="skill-guide__stage-title">詳細練功路線</h4>
        {!onlyCurrentLevel ? (
          <p className="skill-guide__recipe">
            <span className="skill-guide__recipe-label">總覽</span>
            {guide.levelingIntro}
          </p>
        ) : null}
        {currentLevel && focusRoute >= 0 ? (
          <p className="skill-guide__now" role="status">
            Lv.{currentLevel} 目前建議：
            <strong>{guide.leveling[focusRoute]!.range}</strong>
            {' — '}
            {guide.leveling[focusRoute]!.spots}
          </p>
        ) : (
          <p className="skill-guide__now skill-guide__now--muted">
            在上方輸入當前等級，會標出你現在該練哪一段。
          </p>
        )}
        <ol className="skill-guide__routes">
          {visibleRoutes.map((routeItem, index) => {
            const realIndex = onlyCurrentLevel
              ? focusRoute
              : guide.leveling.indexOf(routeItem)
            const status = bracketStatus(routeItem.range, currentLevel)
            const isFocus = realIndex === focusRoute
            const label = statusLabel(isFocus ? 'current' : status)
            return (
              <li
                key={`${routeItem.range}-${index}`}
                className={`skill-guide__route skill-guide__route--${isFocus ? 'current' : status}`}
              >
                <span className="skill-guide__step" aria-hidden="true">
                  {onlyCurrentLevel ? 1 : index + 1}
                </span>
                <span className="skill-guide__range">
                  {routeItem.range}
                  {label ? (
                    <span
                      className={`skill-guide__tag skill-guide__tag--${isFocus ? 'current' : status}`}
                    >
                      {isFocus ? '目前建議' : label}
                    </span>
                  ) : null}
                </span>
                <span className="skill-guide__spots">{routeItem.spots}</span>
                {routeItem.weak ? (
                  <span className="skill-guide__route-weak">
                    <span className="skill-guide__weak-label">弱屬</span>
                    {routeItem.weak}
                  </span>
                ) : null}
                {routeItem.note ? (
                  <span className="skill-guide__route-note">{routeItem.note}</span>
                ) : null}
                {routeItem.quiet ? (
                  <span className="skill-guide__route-quiet">
                    <span className="skill-guide__quiet-label">人少</span>
                    {routeItem.quiet}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>

      {!onlyCurrentLevel ? (
        <>
          <div className="skill-guide__tips">
            <h4 className="skill-guide__stage-title">核心提醒</h4>
            <ul>
              {guide.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <p className="skill-guide__disclaimer">{guide.disclaimer}</p>
        </>
      ) : null}
    </div>
  )
}

export function SkillGuidePanel({
  job,
  defaultOpen = true,
  showServerRules = false,
  currentLevel,
  onlyCurrentLevel = false,
}: SkillGuidePanelProps) {
  const guide = getSkillGuide(job)
  const style = JOB_STYLES[job]
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const onCopyGuide = async () => {
    playClick()
    const text = formatSkillGuideText(guide, currentLevel)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      className="skill-guide rpg-frame"
      style={{ borderColor: style.border }}
      aria-labelledby={panelId}
    >
      <div className="rpg-frame__corners" aria-hidden="true" />
      <div className="skill-guide__toolbar">
        <button
          type="button"
          className="skill-guide__toggle"
          aria-expanded={open}
          aria-controls={`${panelId}-content`}
          id={panelId}
          onClick={() => {
            playClick()
            setOpen((v) => !v)
          }}
        >
          <span className="skill-guide__toggle-emoji" aria-hidden="true">
            {style.emoji}
          </span>
          <span>
            {job}・經典版攻略
            <span className="skill-guide__chevron" aria-hidden="true">
              {open ? '▾' : '▸'}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="btn btn-secondary skill-guide__copy"
          onClick={() => void onCopyGuide()}
        >
          {copied ? '已複製' : '複製攻略'}
        </button>
      </div>

      {open ? (
        <div id={`${panelId}-content`}>
          <GuideBody
            guide={guide}
            showServerRules={showServerRules}
            currentLevel={currentLevel}
            onlyCurrentLevel={onlyCurrentLevel}
          />
        </div>
      ) : null}
    </section>
  )
}

interface SkillGuideBookProps {
  focusJob?: Job
  poolJobs?: Job[]
  showAll?: boolean
}

export function SkillGuideBook({
  focusJob,
  poolJobs,
  showAll = false,
}: SkillGuideBookProps) {
  const others = focusJob
    ? (poolJobs ?? [focusJob]).filter((j) => j !== focusJob)
    : []
  const [levelInput, setLevelInput] = useState(loadStoredLevel)
  const [onlyCurrentLevel, setOnlyCurrentLevel] = useState(false)
  const currentLevel = clampPlayerLevel(levelInput)

  useEffect(() => {
    saveStoredLevel(levelInput)
  }, [levelInput])

  return (
    <div className="skill-guide-book">
      <div className="skill-guide-book__level rpg-frame">
        <div className="rpg-frame__corners" aria-hidden="true" />
        <label htmlFor="player-level" className="skill-guide-book__level-label">
          當前等級
        </label>
        <div className="skill-guide-book__level-row">
          <span className="skill-guide-book__lv" aria-hidden="true">
            Lv.
          </span>
          <input
            id="player-level"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            placeholder="1–100"
            className="player-card__input skill-guide-book__level-input"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value.replace(/[^\d]/g, ''))}
          />
          {levelInput && currentLevel === null ? (
            <span className="skill-guide-book__level-hint skill-guide-book__level-hint--bad">
              請輸入 1–100
            </span>
          ) : (
            <span className="skill-guide-book__level-hint">
              {currentLevel
                ? `已依 Lv.${currentLevel} 標出任務／加點／練功`
                : '輸入後會標出目前該解的任務與練功段'}
            </span>
          )}
        </div>
        <label className="skill-guide-book__only-current">
          <input
            type="checkbox"
            checked={onlyCurrentLevel}
            disabled={!currentLevel}
            onChange={(e) => {
              playClick()
              setOnlyCurrentLevel(e.target.checked)
            }}
          />
          只顯示目前等級相關內容
        </label>
      </div>

      <MustQuestPanel
        currentLevel={currentLevel}
        onlyCurrentLevel={onlyCurrentLevel}
        defaultOpen
      />

      {focusJob ? (
        <SkillGuidePanel
          job={focusJob}
          defaultOpen
          showServerRules
          currentLevel={currentLevel}
          onlyCurrentLevel={onlyCurrentLevel}
        />
      ) : null}
      {focusJob && showAll
        ? others.map((job) => (
            <SkillGuidePanel
              key={job}
              job={job}
              defaultOpen={false}
              currentLevel={currentLevel}
              onlyCurrentLevel={onlyCurrentLevel}
            />
          ))
        : null}
    </div>
  )
}
