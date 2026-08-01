import { JOB_STYLES, displayName } from '../lib/jobs'
import type { Job, Player, PlayerId } from '../types'

interface PlayerCardProps {
  player: Player
  isDrawing: boolean
  spinJob: Job | null
  isLocked: boolean
  allDone: boolean
  onNameChange: (id: PlayerId, name: string) => void
  onDraw: (id: PlayerId) => void
}

export function PlayerCard({
  player,
  isDrawing,
  spinJob,
  isLocked,
  allDone,
  onNameChange,
  onDraw,
}: PlayerCardProps) {
  const hasJob = player.job !== null
  const canDraw = !hasJob && !isLocked
  const shownJob = isDrawing ? spinJob : player.job
  const name = displayName(player.name, player.id)
  const style = shownJob ? JOB_STYLES[shownJob] : null

  return (
    <article
      className={`player-card ${hasJob ? 'player-card--done' : ''} ${isDrawing ? 'player-card--drawing' : ''}`}
      aria-busy={isDrawing}
    >
      <header className="player-card__header">
        <span className="player-card__badge" aria-hidden="true">
          {player.id + 1}
        </span>
        <h2 className="player-card__title">{name}</h2>
      </header>

      <div className="player-card__field">
        <label className="sr-only" htmlFor={`player-name-${player.id}`}>
          玩家 {player.id + 1} 名字
        </label>
        <input
          id={`player-name-${player.id}`}
          type="text"
          className="player-card__input"
          placeholder={`玩家 ${player.id + 1}`}
          value={player.name}
          maxLength={20}
          disabled={isLocked}
          autoComplete="nickname"
          onChange={(e) => onNameChange(player.id, e.target.value)}
          aria-label={`玩家 ${player.id + 1} 名字`}
        />
      </div>

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
        ) : hasJob && player.job && style ? (
          <div className="job-reveal">
            <span className="job-reveal__emoji" aria-hidden="true">
              {JOB_STYLES[player.job].emoji}
            </span>
            <span className="job-reveal__name">{player.job}</span>
            <span className="job-reveal__caption">{name}</span>
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
        onClick={() => onDraw(player.id)}
        aria-label={
          hasJob
            ? `${name} 已完成抽籤`
            : isDrawing
              ? `${name} 抽籤中`
              : isLocked
                ? '其他玩家抽籤中，請稍候'
                : `為 ${name} 開始抽籤`
        }
      >
        {hasJob ? '已抽籤' : isDrawing ? '命運轉動中…' : '開始抽籤'}
      </button>

      {allDone && hasJob ? (
        <p className="player-card__hint">本輪命運已定</p>
      ) : null}
    </article>
  )
}
