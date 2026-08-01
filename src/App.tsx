import { AdventureBackdrop } from './components/AdventureBackdrop'
import { AuthPanel } from './components/AuthPanel'
import { Celebration } from './components/Celebration'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Footer } from './components/Footer'
import { HeroBanner } from './components/HeroBanner'
import { MyDrawCard } from './components/MyDrawCard'
import { ResultPanel } from './components/ResultPanel'
import { Toast } from './components/Toast'
import { useDrawGame } from './hooks/useDrawGame'
import { playClick } from './lib/sfx'

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
      <AdventureBackdrop />
      <Celebration active={showCelebration} />

      <main className="app-main">
        <HeroBanner />

        {phase === 'loading' ? (
          <p className="loading-msg" role="status">
            正在進入村莊…
          </p>
        ) : null}

        {phase === 'auth' ? (
          <AuthPanel
            nameInput={nameInput}
            onNameChange={setNameInput}
            onRegister={() => {
              playClick()
              void handleRegister()
            }}
            onLogin={() => {
              playClick()
              void handleLogin()
            }}
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
                <aside className="roster-side rpg-frame" aria-label="隊伍狀態">
                  <div className="rpg-frame__corners" aria-hidden="true" />
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
                          {session.allDone && p.job
                            ? p.job
                            : p.id === me.id
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
                    {session.allDone
                      ? '三人皆已抽完，完整命運已公布。'
                      : '抽籤進行中不會顯示其他人的職業；全部抽完後才公布。'}
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
                    results: null,
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
