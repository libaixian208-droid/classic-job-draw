import { JOB_STYLES } from '../lib/jobs'
import type { PublicSession } from '../types'
import { playClick } from '../lib/sfx'

interface WatchPanelProps {
  roomCode: string
  session: PublicSession
  onCopyRoomLink: () => void
  onLeave: () => void
  onShare?: () => void
  shareBusy?: boolean
}

export function WatchPanel({
  roomCode,
  session,
  onCopyRoomLink,
  onLeave,
  onShare,
  shareBusy = false,
}: WatchPanelProps) {
  return (
    <section className="watch-panel rpg-frame" aria-labelledby="watch-heading">
      <div className="rpg-frame__corners" aria-hidden="true" />
      <h2 id="watch-heading" className="watch-panel__title">
        觀戰模式
      </h2>
      <p className="watch-panel__desc">
        只看隊伍進度與揭曉結果，不參與抽籤。
      </p>

      <div className="watch-panel__room">
        <span>
          房間 <code>{roomCode}</code>
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            playClick()
            onCopyRoomLink()
          }}
        >
          複製連結
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            playClick()
            onLeave()
          }}
        >
          離開
        </button>
      </div>

      <p className="roster-side__summary">
        {session.registeredCount}/{session.maxPlayers} 人已加入 ·{' '}
        {session.drawnCount} 人已抽籤
        {typeof session.expiresInDays === 'number' ? (
          <> · 約 {session.expiresInDays} 天後閒置過期</>
        ) : null}
      </p>
      <p className="roster-side__jobs">
        職業池：{session.selectedJobs.join('、')}
      </p>

      <ul className="roster-side__list">
        {session.players.map((p) => (
          <li key={p.id}>
            <span>
              {p.name}
              {p.isHost ? '（房主）' : ''}
            </span>
            <span>
              {session.allDone && p.job
                ? p.job
                : p.hasDrawn
                  ? '已抽籤'
                  : '尚未抽籤'}
            </span>
          </li>
        ))}
      </ul>

      {session.allDone && session.results ? (
        <div className="watch-panel__results">
          <h3>命運揭曉</h3>
          <ul className="result-panel__list">
            {session.results.map((r) => {
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
                    <strong>{r.name}</strong>
                    <span aria-hidden="true"> → </span>
                    <span style={{ color: style.accent }}>{r.job}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          {onShare ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={shareBusy}
              onClick={() => {
                playClick()
                onShare()
              }}
            >
              {shareBusy ? '產生中…' : '分享結果圖'}
            </button>
          ) : null}
        </div>
      ) : (
        <p className="roster-side__hint">全員抽完後會在此公布完整結果。</p>
      )}
    </section>
  )
}
