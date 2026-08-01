import { useId, useState } from 'react'
import { JOB_STYLES } from '../lib/jobs'
import {
  formatSkillGuideText,
  getSkillGuide,
  SERVER_RULES,
  type SkillGuide,
} from '../lib/skillGuides'
import { playClick } from '../lib/sfx'
import type { Job } from '../types'

interface SkillGuidePanelProps {
  job: Job
  defaultOpen?: boolean
  showServerRules?: boolean
}

function GuideBody({
  guide,
  showServerRules,
}: {
  guide: SkillGuide
  showServerRules: boolean
}) {
  const style = JOB_STYLES[guide.job]

  return (
    <div className="skill-guide__body">
      <p className="skill-guide__meta">
        <span style={{ color: style.accent }}>{guide.path}</span>
      </p>
      <p className="skill-guide__role">{guide.role}</p>
      <p className="skill-guide__badge-row">
        <span className="skill-guide__pill">Lv.100 上限</span>
        <span className="skill-guide__pill">最高二轉</span>
      </p>

      {showServerRules ? (
        <div className="skill-guide__stage skill-guide__stage--rules">
          <h4 className="skill-guide__stage-title">{SERVER_RULES.title}</h4>
          <ul className="skill-guide__bullets">
            {SERVER_RULES.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

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

      {guide.stages.map((stage) => (
        <div key={stage.title} className="skill-guide__stage">
          <h4 className="skill-guide__stage-title">{stage.title}</h4>
          <p className="skill-guide__stage-summary">{stage.summary}</p>
          <ol className="skill-guide__list">
            {stage.priorities.map((p) => (
              <li key={`${stage.title}-${p.skill}-${p.points}`}>
                <span className="skill-guide__skill">{p.skill}</span>
                <span className="skill-guide__points">{p.points}</span>
                {p.note ? (
                  <span className="skill-guide__note">{p.note}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}

      <div className="skill-guide__stage">
        <h4 className="skill-guide__stage-title">練功路線</h4>
        <ul className="skill-guide__routes">
          {guide.leveling.map((route) => (
            <li key={route.range}>
              <span className="skill-guide__range">{route.range}</span>
              <span className="skill-guide__spots">{route.spots}</span>
              {route.note ? (
                <span className="skill-guide__route-note">{route.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="skill-guide__tips">
        <h4 className="skill-guide__stage-title">核心提醒</h4>
        <ul>
          {guide.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <p className="skill-guide__disclaimer">{guide.disclaimer}</p>
    </div>
  )
}

export function SkillGuidePanel({
  job,
  defaultOpen = true,
  showServerRules = false,
}: SkillGuidePanelProps) {
  const guide = getSkillGuide(job)
  const style = JOB_STYLES[job]
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const onCopyGuide = async () => {
    playClick()
    const text = formatSkillGuideText(guide)
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
          <GuideBody guide={guide} showServerRules={showServerRules} />
        </div>
      ) : null}
    </section>
  )
}

interface SkillGuideBookProps {
  focusJob: Job
  showAll?: boolean
}

export function SkillGuideBook({ focusJob, showAll = false }: SkillGuideBookProps) {
  const others = (['槍騎兵', '僧侶', '冰雷巫師'] as Job[]).filter(
    (j) => j !== focusJob,
  )

  return (
    <div className="skill-guide-book">
      <SkillGuidePanel job={focusJob} defaultOpen showServerRules />
      {showAll
        ? others.map((job) => (
            <SkillGuidePanel key={job} job={job} defaultOpen={false} />
          ))
        : null}
    </div>
  )
}
