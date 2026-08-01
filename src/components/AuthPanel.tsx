import { JOB_STYLES } from '../lib/jobs'
import type { PublicSession } from '../types'

interface AuthPanelProps {
  nameInput: string
  onNameChange: (value: string) => void
  onRegister: () => void
  onLogin: () => void
  busy: boolean
  error: string | null
  session: PublicSession | null
}

export function AuthPanel({
  nameInput,
  onNameChange,
  onRegister,
  onLogin,
  busy,
  error,
  session,
}: AuthPanelProps) {
  const canSubmit = nameInput.trim().length > 0 && !busy
  const full = (session?.registeredCount ?? 0) >= (session?.maxPlayers ?? 3)
  const revealed = session?.allDone ? session.results : null

  return (
    <section className="auth-panel" aria-labelledby="auth-heading">
      <h2 id="auth-heading" className="auth-panel__title">
        冒險者登記
      </h2>
      <p className="auth-panel__desc">
        輸入名字註冊或登入。抽籤過程中只能看到自己的結果，三人全部抽完後會公布。
      </p>

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
            if (e.key === 'Enter' && canSubmit) {
              if (full) onLogin()
              else onRegister()
            }
          }}
        />
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
          {full ? '人數已滿' : busy ? '處理中…' : '註冊'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canSubmit}
          onClick={onLogin}
        >
          登入
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
                <span className="auth-panel__status" style={{ color: JOB_STYLES[r.job].accent }}>
                  {r.job}
                </span>
              </li>
            ))}
          </ul>
        ) : session && session.players.length > 0 ? (
          <ul className="auth-panel__list">
            {session.players.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
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
        </p>
      </div>
    </section>
  )
}
