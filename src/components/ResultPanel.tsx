import { JOB_STYLES } from '../lib/jobs'
import type { PrivatePlayer, PublicSession } from '../types'

interface ResultPanelProps {
  me: PrivatePlayer
  session: PublicSession
  onCopy: () => void
  onReset: () => void
  resetDisabled: boolean
}

export function ResultPanel({
  me,
  session,
  onCopy,
  onReset,
  resetDisabled,
}: ResultPanelProps) {
  if (!me.job) return null
  const style = JOB_STYLES[me.job]

  return (
    <section className="result-panel" aria-labelledby="result-heading">
      <div className="result-panel__glow" aria-hidden="true" />
      <h2 id="result-heading" className="result-panel__title">
        {session.allDone ? '全員命運已定！' : '你的命運揭曉！'}
      </h2>
      <ul className="result-panel__list">
        <li
          className="result-panel__item"
          style={{
            borderColor: style.border,
            backgroundColor: style.soft,
          }}
        >
          <span className="result-panel__emoji" aria-hidden="true">
            {style.emoji}
          </span>
          <span className="result-panel__text">
            <strong>{me.name}</strong>
            <span aria-hidden="true"> → </span>
            <span className="sr-only"> 抽中 </span>
            <span style={{ color: style.accent }}>{me.job}</span>
          </span>
        </li>
      </ul>
      <p className="result-panel__privacy">
        其他冒險者的職業不會顯示在這裡，請各自登入查看。
        {session.allDone
          ? `（${session.drawnCount}/${session.maxPlayers} 人皆已抽完）`
          : `（目前 ${session.drawnCount}/${session.registeredCount} 人已抽籤）`}
      </p>
      <div className="result-panel__actions">
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          複製我的結果
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          disabled={resetDisabled}
        >
          重新抽籤
        </button>
      </div>
    </section>
  )
}
