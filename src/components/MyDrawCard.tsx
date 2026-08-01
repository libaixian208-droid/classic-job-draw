import { JOB_STYLES } from '../lib/jobs'
import type { Job, PrivatePlayer } from '../types'

interface MyDrawCardProps {
  me: PrivatePlayer
  isDrawing: boolean
  spinJob: Job | null
  onDraw: () => void
  onLogout: () => void
}

export function MyDrawCard({
  me,
  isDrawing,
  spinJob,
  onDraw,
  onLogout,
}: MyDrawCardProps) {
  const hasJob = me.job !== null
  const canDraw = !hasJob && !isDrawing
  const shownJob = isDrawing ? spinJob : me.job
  const style = shownJob ? JOB_STYLES[shownJob] : null

  return (
    <article
      className={`player-card player-card--solo ${hasJob ? 'player-card--done' : ''} ${isDrawing ? 'player-card--drawing' : ''}`}
      aria-busy={isDrawing}
    >
      <header className="player-card__header">
        <span className="player-card__badge" aria-hidden="true">
          {me.id + 1}
        </span>
        <h2 className="player-card__title">{me.name}</h2>
      </header>

      <div
        className="player-card__result"
        style={
          style
            ? {
                backgroundColor: style.soft,
                borderColor: style.border,
                color: style.accent,
              }
            : undefined
        }
        aria-live={isDrawing ? 'polite' : undefined}
      >
        {isDrawing && shownJob && style ? (
          <div className="job-reveal job-reveal--spin">
            <span className="job-reveal__emoji" aria-hidden="true">
              {style.emoji}
            </span>
            <span className="job-reveal__name">{shownJob}</span>
            <span className="sr-only">抽籤中</span>
          </div>
        ) : hasJob && me.job && style ? (
          <div className="job-reveal">
            <span className="job-reveal__emoji" aria-hidden="true">
              {JOB_STYLES[me.job].emoji}
            </span>
            <span className="job-reveal__name">{me.job}</span>
            <span className="job-reveal__caption">這是只屬於你的命運</span>
          </div>
        ) : (
          <div className="job-reveal job-reveal--pending">
            <span className="job-reveal__mystery" aria-hidden="true">
              ？
            </span>
            <span className="job-reveal__caption">命運尚未揭曉</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn btn-primary player-card__draw"
        disabled={!canDraw}
        onClick={onDraw}
        aria-label={
          hasJob
            ? '你已完成抽籤'
            : isDrawing
              ? '抽籤中'
              : '開始抽籤'
        }
      >
        {hasJob ? '已抽籤' : isDrawing ? '命運轉動中…' : '開始抽籤'}
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onLogout}
        disabled={isDrawing}
      >
        登出
      </button>
    </article>
  )
}
