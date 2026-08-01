import { AdventureBackdrop } from './components/AdventureBackdrop'
import { AuthPanel } from './components/AuthPanel'
import { Celebration } from './components/Celebration'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Footer } from './components/Footer'
import { HeroBanner } from './components/HeroBanner'
import { HostControls } from './components/HostControls'
import { MyDrawCard } from './components/MyDrawCard'
import { ResultPanel } from './components/ResultPanel'
import { RoomLobby } from './components/RoomLobby'
import { Toast } from './components/Toast'
import { WatchPanel } from './components/WatchPanel'
import { useDrawGame } from './hooks/useDrawGame'
import { playClick } from './lib/sfx'

export default function App() {
  const {
    phase,
    roomCode,
    me,
    session,
    nameInput,
    setNameInput,
    passcodeInput,
    setPasscodeInput,
    roomInput,
    setRoomInput,
    selectedJobs,
    setSelectedJobs,
    authBusy,
    lobbyBusy,
    hostBusy,
    shareBusy,
    drawing,
    spinJob,
    toast,
    error,
    confirmReset,
    kickTargetName,
    createRoom,
    joinRoom,
    watchRoom,
    enterWatchFromAuth,
    leaveRoom,
    handleRegister,
    handleLogin,
    handleAuthEnter,
    logout,
    draw,
    requestReset,
    cancelReset,
    confirmResetAction,
    updateJobs,
    requestKick,
    cancelKick,
    confirmKickAction,
    copyResults,
    shareResults,
    copyRoomLink,
  } = useDrawGame()

  const showCelebration = Boolean(me?.job) && Boolean(session?.allDone)
  const isHost = Boolean(me?.isHost)

  return (
    <div className="app-shell">
      <AdventureBackdrop />
      <Celebration active={showCelebration} />

      <main className="app-main">
        <HeroBanner subtitle="新楓之谷：經典版・開房勾職業。100 級／目前最高二轉。" />

        {phase === 'loading' ? (
          <p className="loading-msg" role="status">
            正在進入村莊…
          </p>
        ) : null}

        {phase === 'lobby' ? (
          <RoomLobby
            roomInput={roomInput}
            onRoomInputChange={setRoomInput}
            selectedJobs={selectedJobs}
            onSelectedJobsChange={setSelectedJobs}
            onCreate={() => {
              playClick()
              void createRoom()
            }}
            onJoin={() => {
              playClick()
              void joinRoom()
            }}
            onWatch={() => {
              playClick()
              void watchRoom()
            }}
            busy={lobbyBusy}
            error={error}
          />
        ) : null}

        {phase === 'watch' && roomCode && session ? (
          <WatchPanel
            roomCode={roomCode}
            session={session}
            onCopyRoomLink={() => void copyRoomLink()}
            onLeave={leaveRoom}
            onShare={
              session.allDone && session.results
                ? () => void shareResults()
                : undefined
            }
            shareBusy={shareBusy}
          />
        ) : null}

        {phase === 'auth' && roomCode ? (
          <AuthPanel
            nameInput={nameInput}
            onNameChange={setNameInput}
            passcodeInput={passcodeInput}
            onPasscodeChange={setPasscodeInput}
            onRegister={() => {
              playClick()
              void handleRegister()
            }}
            onLogin={() => {
              playClick()
              void handleLogin()
            }}
            onEnterSubmit={() => {
              playClick()
              handleAuthEnter()
            }}
            onLeaveRoom={() => {
              playClick()
              void leaveRoom()
            }}
            onCopyRoomLink={() => {
              playClick()
              void copyRoomLink()
            }}
            onWatch={() => {
              playClick()
              enterWatchFromAuth()
            }}
            roomCode={roomCode}
            busy={authBusy}
            error={error}
            session={session}
          />
        ) : null}

        {phase === 'ready' && me && roomCode ? (
          <>
            <section className="solo-layout" aria-label="我的抽籤">
              <MyDrawCard
                me={me}
                isDrawing={drawing}
                spinJob={spinJob}
                onDraw={() => void draw()}
                onLogout={logout}
                onLeaveRoom={() => void leaveRoom()}
              />

              {session ? (
                <aside className="roster-side rpg-frame" aria-label="隊伍狀態">
                  <div className="rpg-frame__corners" aria-hidden="true" />
                  <h2 className="roster-side__title">隊伍狀態</h2>
                  <p className="roster-side__room">
                    房間 <code>{roomCode}</code>
                    <button
                      type="button"
                      className="btn btn-secondary roster-side__copy"
                      onClick={() => {
                        playClick()
                        void copyRoomLink()
                      }}
                    >
                      複製連結
                    </button>
                  </p>
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
                          {p.id === me.id ? '（你）' : ''}
                          {p.isHost ? '（房主）' : ''}
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
                      ? '全員皆已抽完，完整命運已公布。'
                      : '抽籤進行中不會顯示其他人的職業；全部抽完後才公布。'}
                  </p>
                  {isHost ? (
                    <HostControls
                      session={session}
                      myId={me.id}
                      busy={hostBusy || drawing}
                      onUpdateJobs={(jobs) => void updateJobs(jobs)}
                      onKick={requestKick}
                    />
                  ) : null}
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
                    roomCode,
                    registeredCount: 1,
                    maxPlayers: 1,
                    drawnCount: 1,
                    allDone: false,
                    selectedJobs: me.job ? [me.job] : [],
                    players: [],
                    results: null,
                    updatedAt: new Date().toISOString(),
                    expiresInDays: 14,
                  }
                }
                onCopy={() => void copyResults()}
                onShare={
                  session?.allDone && session.results
                    ? () => void shareResults()
                    : undefined
                }
                shareBusy={shareBusy}
                onReset={requestReset}
                resetDisabled={drawing}
                canReset={isHost}
              />
            ) : (
              <div className="toolbar">
                {isHost ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={requestReset}
                    disabled={drawing}
                  >
                    重新抽籤
                  </button>
                ) : (
                  <p className="result-panel__host-hint">只有房主可以重新抽籤</p>
                )}
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

      <ConfirmDialog
        open={kickTargetName !== null}
        title="踢出玩家"
        message={`確定要踢出「${kickTargetName ?? ''}」嗎？若對方已抽籤，職業會回到池中。`}
        confirmLabel="確定踢出"
        cancelLabel="取消"
        onConfirm={() => void confirmKickAction()}
        onCancel={cancelKick}
      />
    </div>
  )
}
