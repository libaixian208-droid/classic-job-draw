import { JOB_STYLES } from '../lib/jobs'
import type { PrivatePlayer, PublicSession, RevealedResult } from '../types'

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

  const revealed: RevealedResult[] | null = session.allDone
    ? (session.results ??
      (session.players.every((p) => p.job)
        ? session.players.map((p) => ({
            id: p.id,
            name: p.name,
            job: p.job!,
          }))
        : null))
    : null

  return (
    <section className="result-panel rpg-frame" aria-labelledby="result-heading">
      <div className="rpg-frame__corners" aria-hidden="true" />
      <div className="result-panel__glow" aria-hidden="true" />
      <h2 id="result-heading" className="result-panel__title">
        {revealed ? '命運揭曉！' : '你的命運揭曉！'}
      </h2>

      {revealed ? (
        <ul className="result-panel__list">
          {revealed.map((r) => {
            const style = JOB_STYLES[r.job]
            return (
              <li
                key={r.id}
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
                  <strong>
                    {r.name}
                    {r.id === me.id ? '（你）' : ''}
                  </strong>
                  <span aria-hidden="true"> → </span>
                  <span className="sr-only"> 抽中 </span>
                  <span style={{ color: style.accent }}>{r.job}</span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <>
          <ul className="result-panel__list">
            <li
              className="result-panel__item"
              style={{
                borderColor: JOB_STYLES[me.job].border,
                backgroundColor: JOB_STYLES[me.job].soft,
              }}
            >
              <span className="result-panel__emoji" aria-hidden="true">
                {JOB_STYLES[me.job].emoji}
              </span>
              <span className="result-panel__text">
                <strong>{me.name}</strong>
                <span aria-hidden="true"> → </span>
                <span className="sr-only"> 抽中 </span>
                <span style={{ color: JOB_STYLES[me.job].accent }}>
                  {me.job}
                </span>
              </span>
            </li>
          </ul>
          <p className="result-panel__privacy">
            其他人抽完後會公布完整結果。
            （目前 {session.drawnCount}/{session.maxPlayers} 人已抽籤）
          </p>
        </>
      )}

      <div className="result-panel__actions">
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          {revealed ? '複製結果' : '複製我的結果'}
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
