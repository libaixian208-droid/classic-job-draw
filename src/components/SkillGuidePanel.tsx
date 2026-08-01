import { useId, useState } from 'react'
import { JOB_STYLES } from '../lib/jobs'
import {
  formatSkillGuideText,
  getSkillGuide,
  type SkillGuide,
} from '../lib/skillGuides'
import { playClick } from '../lib/sfx'
import type { Job } from '../types'

interface SkillGuidePanelProps {
  job: Job
  defaultOpen?: boolean
}

function GuideBody({ guide }: { guide: SkillGuide }) {
  const style = JOB_STYLES[guide.job]

  return (
    <div className="skill-guide__body">
      <p className="skill-guide__meta">
        <span style={{ color: style.accent }}>{guide.path}</span>
      </p>
      <p className="skill-guide__role">{guide.role}</p>
      <p className="skill-guide__stat">
        <strong>能力值：</strong>
        {guide.stat}
      </p>

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

      <div className="skill-guide__tips">
        <h4 className="skill-guide__stage-title">冒險小提示</h4>
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
            {job}・技能加點推薦
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
          {copied ? '已複製' : '複製加點'}
        </button>
      </div>

      {open ? (
        <div id={`${panelId}-content`}>
          <GuideBody guide={guide} />
        </div>
      ) : null}
    </section>
  )
}

interface SkillGuideBookProps {
  focusJob: Job
  showAll?: boolean
}

/** Shows your job guide; after full reveal, also lists the other two collapsed. */
export function SkillGuideBook({ focusJob, showAll = false }: SkillGuideBookProps) {
  const others = (['槍騎兵', '僧侶', '冰雷巫師'] as Job[]).filter(
    (j) => j !== focusJob,
  )

  return (
    <div className="skill-guide-book">
      <SkillGuidePanel job={focusJob} defaultOpen />
      {showAll
        ? others.map((job) => (
            <SkillGuidePanel key={job} job={job} defaultOpen={false} />
          ))
        : null}
    </div>
  )
}
