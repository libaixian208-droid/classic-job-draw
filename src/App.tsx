import { AuthPanel } from './components/AuthPanel'
import { Celebration } from './components/Celebration'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Footer } from './components/Footer'
import { MyDrawCard } from './components/MyDrawCard'
import { ResultPanel } from './components/ResultPanel'
import { Toast } from './components/Toast'
import { useDrawGame } from './hooks/useDrawGame'

export default function App() {
  const {
    phase,
    me,
    session,
    nameInput,
    setNameInput,
    authBusy,
    drawing,
    spinJob,
    toast,
    error,
    confirmReset,
    handleRegister,
    handleLogin,
    logout,
    draw,
    requestReset,
    cancelReset,
    confirmResetAction,
    copyResults,
  } = useDrawGame()

  const showCelebration = Boolean(me?.job) && Boolean(session?.allDone)

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <div className="app-bg__sky" />
        <div className="app-bg__hills" />
        <div className="app-bg__pixels" />
      </div>

      <Celebration active={showCelebration} />

      <main className="app-main">
        <header className="hero">
          <p className="hero__eyebrow">Classic Server · Job Fate</p>
          <h1 className="hero__title">經典服職業命運抽籤</h1>
          <p className="hero__subtitle">三個冒險者，三種命運。</p>
        </header>

        {phase === 'loading' ? (
          <p className="loading-msg" role="status">
            載入中…
          </p>
        ) : null}

        {phase === 'auth' ? (
          <AuthPanel
            nameInput={nameInput}
            onNameChange={setNameInput}
            onRegister={() => void handleRegister()}
            onLogin={() => void handleLogin()}
            busy={authBusy}
            error={error}
            session={session}
          />
        ) : null}

        {phase === 'ready' && me ? (
          <>
            <section className="solo-layout" aria-label="我的抽籤">
              <MyDrawCard
                me={me}
                isDrawing={drawing}
                spinJob={spinJob}
                onDraw={() => void draw()}
                onLogout={logout}
              />

              {session ? (
                <aside className="roster-side" aria-label="隊伍狀態">
                  <h2 className="roster-side__title">隊伍狀態</h2>
                  <p className="roster-side__summary">
                    {session.registeredCount}/{session.maxPlayers} 人已加入 ·{' '}
                    {session.drawnCount} 人已抽籤
                  </p>
                  <ul className="roster-side__list">
                    {session.players.map((p) => (
                      <li key={p.id}>
                        <span>
                          {p.name}
                          {p.id === me.id ? '（你）' : ''}
                        </span>
                        <span>
                          {p.id === me.id
                            ? me.job
                              ? '已揭曉'
                              : '尚未抽籤'
                            : p.hasDrawn
                              ? '已抽籤'
                              : '命運尚未揭曉'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="roster-side__hint">
                    其他人的職業結果不會顯示，避免劇透。
                  </p>
                </aside>
              ) : null}
            </section>

            {error ? (
              <p className="auth-panel__error" role="alert">
                {error}
              </p>
            ) : null}

            {me.job ? (
              <ResultPanel
                me={me}
                session={
                  session ?? {
                    registeredCount: 1,
                    maxPlayers: 3,
                    drawnCount: 1,
                    allDone: false,
                    players: [],
                  }
                }
                onCopy={() => void copyResults()}
                onReset={requestReset}
                resetDisabled={drawing}
              />
            ) : (
              <div className="toolbar">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={requestReset}
                  disabled={drawing}
                >
                  重新抽籤
                </button>
              </div>
            )}
          </>
        ) : null}
      </main>

      <Footer />
      <Toast message={toast} />

      <ConfirmDialog
        open={confirmReset}
        title="重新抽籤"
        message="確定要重新抽籤嗎？目前結果將會全部清除。（已註冊的名字會保留）"
        confirmLabel="確定重抽"
        cancelLabel="取消"
        onConfirm={() => void confirmResetAction()}
        onCancel={cancelReset}
      />
    </div>
  )
}
