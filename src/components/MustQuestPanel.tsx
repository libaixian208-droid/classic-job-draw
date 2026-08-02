import { useId, useState } from 'react'
import {
  formatMustQuestsText,
  MUST_QUEST_INTRO,
  MUST_QUESTS,
  questBracketStatus,
  type MustQuest,
} from '../lib/mustQuests'
import { playClick } from '../lib/sfx'

const CAT_LABEL: Record<MustQuest['category'], string> = {
  party: '組隊衝等',
  patience: '忍耐解鎖',
  gear: '裝備必解',
  event: '活動領取',
}

const PRI_LABEL: Record<MustQuest['priority'], string> = {
  critical: '必做',
  high: '強烈建議',
  normal: '值得解',
}

function statusLabel(status: string): string | null {
  if (status === 'current') return '目前'
  if (status === 'past') return '已過'
  if (status === 'future') return '之後'
  return null
}

interface MustQuestPanelProps {
  currentLevel: number | null
  onlyCurrentLevel?: boolean
  defaultOpen?: boolean
}

export function MustQuestPanel({
  currentLevel,
  onlyCurrentLevel = false,
  defaultOpen = true,
}: MustQuestPanelProps) {
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const quests = onlyCurrentLevel
    ? MUST_QUESTS.filter(
        (q) => questBracketStatus(q, currentLevel) === 'current',
      )
    : MUST_QUESTS

  const onCopy = async () => {
    playClick()
    try {
      await navigator.clipboard.writeText(formatMustQuestsText(currentLevel))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="must-quest rpg-frame" aria-labelledby={panelId}>
      <div className="rpg-frame__corners" aria-hidden="true" />
      <div className="must-quest__toolbar">
        <button
          type="button"
          className="must-quest__toggle"
          aria-expanded={open}
          aria-controls={`${panelId}-content`}
          id={panelId}
          onClick={() => {
            playClick()
            setOpen((v) => !v)
          }}
        >
          <span className="must-quest__toggle-emoji" aria-hidden="true">
            📜
          </span>
          <span>
            {MUST_QUEST_INTRO.title}
            <span className="must-quest__chevron" aria-hidden="true">
              {open ? '▾' : '▸'}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="btn btn-secondary must-quest__copy"
          onClick={() => void onCopy()}
        >
          {copied ? '已複製' : '複製任務'}
        </button>
      </div>

      {open ? (
        <div id={`${panelId}-content`} className="must-quest__body">
          <p className="must-quest__summary">{MUST_QUEST_INTRO.summary}</p>
          {currentLevel ? (
            <p className="skill-guide__now" role="status">
              Lv.{currentLevel}：已標出目前可接／應做的必解任務。
            </p>
          ) : (
            <p className="skill-guide__now skill-guide__now--muted">
              上方輸入當前等級後，會標出目前該解哪些。
            </p>
          )}

          {quests.length === 0 ? (
            <p className="must-quest__empty">
              目前等級沒有對應必解任務；可關閉「僅目前等級」看完整清單。
            </p>
          ) : null}

          {(['party', 'patience', 'gear', 'event'] as const).map((cat) => {
            const list = quests.filter((q) => q.category === cat)
            if (list.length === 0) return null
            return (
              <div key={cat} className="must-quest__cat">
                <h3 className="must-quest__cat-title">{CAT_LABEL[cat]}</h3>
                <ul className="must-quest__list">
                  {list.map((q) => {
                    const status = questBracketStatus(q, currentLevel)
                    const label = statusLabel(status)
                    return (
                      <li
                        key={q.id}
                        className={`must-quest__item must-quest__item--${status}`}
                      >
                        <div className="must-quest__item-head">
                          <strong>{q.title}</strong>
                          <span className="must-quest__meta">
                            <span className="must-quest__lv">Lv.{q.level}</span>
                            <span
                              className={`must-quest__pri must-quest__pri--${q.priority}`}
                            >
                              {PRI_LABEL[q.priority]}
                            </span>
                            {label ? (
                              <span
                                className={`skill-guide__tag skill-guide__tag--${status}`}
                              >
                                {label}
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <p className="must-quest__why">{q.why}</p>
                        <p className="must-quest__npc">
                          <strong>NPC／地點</strong>
                          {q.npc} · {q.where}
                        </p>
                        <p className="must-quest__reward">
                          <strong>獎勵</strong>
                          {q.reward}
                        </p>
                        <ol className="must-quest__steps">
                          {q.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        {q.tips && q.tips.length > 0 ? (
                          <ul className="must-quest__tips">
                            {q.tips.map((tip) => (
                              <li key={tip}>{tip}</li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          <p className="must-quest__sources">{MUST_QUEST_INTRO.sources}</p>
        </div>
      ) : null}
    </section>
  )
}
