import { JOB_STYLES, displayName } from '../lib/jobs'
import type { Player } from '../types'

interface ResultPanelProps {
  players: Player[]
  onCopy: () => void
  onReset: () => void
  resetDisabled: boolean
}

export function ResultPanel({
  players,
  onCopy,
  onReset,
  resetDisabled,
}: ResultPanelProps) {
  return (
    <section className="result-panel" aria-labelledby="result-heading">
      <div className="result-panel__glow" aria-hidden="true" />
      <h2 id="result-heading" className="result-panel__title">
        命運揭曉！
      </h2>
      <ul className="result-panel__list">
        {players.map((player) => {
          if (!player.job) return null
          const style = JOB_STYLES[player.job]
          const name = displayName(player.name, player.id)
          return (
            <li
              key={player.id}
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
                <strong>{name}</strong>
                <span aria-hidden="true"> → </span>
                <span className="sr-only"> 抽中 </span>
                <span style={{ color: style.accent }}>{player.job}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <div className="result-panel__actions">
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          複製結果
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
