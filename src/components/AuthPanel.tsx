import { JOB_STYLES } from '../lib/jobs'
import type { PublicSession } from '../types'

interface AuthPanelProps {
  nameInput: string
  onNameChange: (value: string) => void
  passcodeInput: string
  onPasscodeChange: (value: string) => void
  onRegister: () => void
  onLogin: () => void
  onEnterSubmit: () => void
  onLeaveRoom: () => void
  onCopyRoomLink: () => void
  onWatch: () => void
  roomCode: string
  busy: boolean
  error: string | null
  session: PublicSession | null
}

export function AuthPanel({
  nameInput,
  onNameChange,
  passcodeInput,
  onPasscodeChange,
  onRegister,
  onLogin,
  onEnterSubmit,
  onLeaveRoom,
  onCopyRoomLink,
  onWatch,
  roomCode,
  busy,
  error,
  session,
}: AuthPanelProps) {
  const pinOk = /^\d{4,8}$/.test(passcodeInput)
  const canSubmit = nameInput.trim().length > 0 && pinOk && !busy
  const full = (session?.registeredCount ?? 0) >= (session?.maxPlayers ?? 3)
  const revealed = session?.allDone ? session.results : null

  return (
    <section className="auth-panel rpg-frame" aria-labelledby="auth-heading">
      <div className="rpg-frame__corners" aria-hidden="true" />
      <h2 id="auth-heading" className="auth-panel__title">
        村莊冒險者登記處
      </h2>
      <p className="auth-panel__desc">
        用名字＋通行碼登記座位。抽籤途中只見自己的命運；「換房間」會釋出名額。
      </p>

      <div className="auth-panel__room">
        <span className="auth-panel__room-label">房間</span>
        <code className="auth-panel__room-code">{roomCode}</code>
        <button
          type="button"
          className="btn btn-secondary auth-panel__room-btn"
          onClick={onCopyRoomLink}
        >
          複製連結
        </button>
        <button
          type="button"
          className="btn btn-secondary auth-panel__room-btn"
          onClick={onLeaveRoom}
        >
          換房間
        </button>
        <button
          type="button"
          className="btn btn-secondary auth-panel__room-btn"
          onClick={onWatch}
        >
          改觀戰
        </button>
      </div>

      <div className="auth-panel__field">
        <label htmlFor="adventurer-name">你的名字</label>
        <input
          id="adventurer-name"
          type="text"
          className="player-card__input"
          placeholder="例如：阿明"
          value={nameInput}
          maxLength={20}
          disabled={busy}
          autoComplete="nickname"
          autoFocus
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) onEnterSubmit()
          }}
        />
      </div>

      <div className="auth-panel__field">
        <label htmlFor="adventurer-passcode">通行碼（4～8 位數字）</label>
        <input
          id="adventurer-passcode"
          type="password"
          inputMode="numeric"
          className="player-card__input"
          placeholder="例如：2580"
          value={passcodeInput}
          maxLength={8}
          disabled={busy}
          autoComplete="current-password"
          onChange={(e) =>
            onPasscodeChange(e.target.value.replace(/\D/g, '').slice(0, 8))
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) onEnterSubmit()
          }}
        />
        <p className="auth-panel__pin-hint">
          註冊時設定；舊座位若尚未設通行碼，登入時輸入的數字會成為新通行碼。
        </p>
      </div>

      {error ? (
        <p className="auth-panel__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="auth-panel__actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit || full}
          onClick={onRegister}
        >
          {full ? '隊伍已滿' : busy ? '蓋印中…' : '註冊入隊'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canSubmit}
          onClick={onLogin}
        >
          回到村莊
        </button>
      </div>

      <div className="auth-panel__roster">
        <h3 className="auth-panel__roster-title">
          {revealed ? '命運揭曉！' : '目前冒險者'}
        </h3>
        {revealed && revealed.length > 0 ? (
          <ul className="auth-panel__list">
            {revealed.map((r) => (
              <li key={r.id}>
                <span>
                  {JOB_STYLES[r.job].emoji} {r.name}
                </span>
                <span
                  className="auth-panel__status"
                  style={{ color: JOB_STYLES[r.job].accent }}
                >
                  {r.job}
                </span>
              </li>
            ))}
          </ul>
        ) : session && session.players.length > 0 ? (
          <ul className="auth-panel__list">
            {session.players.map((p) => (
              <li key={p.id}>
                <span>
                  {p.name}
                  {p.isHost ? '（房主）' : ''}
                </span>
                <span className="auth-panel__status">
                  {p.hasDrawn ? '已抽籤' : '尚未抽籤'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="auth-panel__empty">還沒有人註冊，當第一位冒險者吧！</p>
        )}
        <p className="auth-panel__slots">
          {session
            ? revealed
              ? '本輪抽籤已全部完成'
              : `${session.registeredCount} / ${session.maxPlayers} 人已加入`
            : '讀取中…'}
          {session && typeof session.expiresInDays === 'number'
            ? ` · 約 ${session.expiresInDays} 天後閒置過期`
            : ''}
        </p>
        {session && session.selectedJobs.length > 0 ? (
          <p className="auth-panel__jobs">
            職業池（{session.maxPlayers} 人）：
            {session.selectedJobs.join('、')}
          </p>
        ) : null}
      </div>
    </section>
  )
}
