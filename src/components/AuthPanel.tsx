interface AuthPanelProps {
  nameInput: string
  onNameChange: (value: string) => void
  onRegister: () => void
  onLogin: () => void
  busy: boolean
  error: string | null
  session: {
    registeredCount: number
    maxPlayers: number
    players: { id: number; name: string; hasDrawn: boolean }[]
  } | null
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

  return (
    <section className="auth-panel" aria-labelledby="auth-heading">
      <h2 id="auth-heading" className="auth-panel__title">
        冒險者登記
      </h2>
      <p className="auth-panel__desc">
        輸入名字註冊或登入。每位冒險者只能看到自己的職業命運。
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
        <h3 className="auth-panel__roster-title">目前冒險者</h3>
        {session && session.players.length > 0 ? (
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
            ? `${session.registeredCount} / ${session.maxPlayers} 人已加入`
            : '讀取中…'}
        </p>
      </div>
    </section>
  )
}
