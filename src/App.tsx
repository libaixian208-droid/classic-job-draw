import { Celebration } from './components/Celebration'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Footer } from './components/Footer'
import { PlayerCard } from './components/PlayerCard'
import { ResultPanel } from './components/ResultPanel'
import { Toast } from './components/Toast'
import { useDrawGame } from './hooks/useDrawGame'

export default function App() {
  const {
    players,
    drawingPlayerId,
    spinJob,
    isLocked,
    allDone,
    toast,
    confirmReset,
    setPlayerName,
    drawForPlayer,
    requestReset,
    cancelReset,
    confirmResetAction,
    copyResults,
  } = useDrawGame()

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <div className="app-bg__sky" />
        <div className="app-bg__hills" />
        <div className="app-bg__pixels" />
      </div>

      <Celebration active={allDone} />

      <main className="app-main">
        <header className="hero">
          <p className="hero__eyebrow">Classic Server · Job Fate</p>
          <h1 className="hero__title">經典服職業命運抽籤</h1>
          <p className="hero__subtitle">三個冒險者，三種命運。</p>
        </header>

        <section
          className="player-grid"
          aria-label="三位冒險者抽籤區"
        >
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isDrawing={drawingPlayerId === player.id}
              spinJob={drawingPlayerId === player.id ? spinJob : null}
              isLocked={isLocked}
              allDone={allDone}
              onNameChange={setPlayerName}
              onDraw={drawForPlayer}
            />
          ))}
        </section>

        {allDone ? (
          <ResultPanel
            players={players}
            onCopy={copyResults}
            onReset={requestReset}
            resetDisabled={isLocked}
          />
        ) : (
          <div className="toolbar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={requestReset}
              disabled={isLocked}
            >
              重新抽籤
            </button>
          </div>
        )}
      </main>

      <Footer />
      <Toast message={toast} />

      <ConfirmDialog
        open={confirmReset}
        title="重新抽籤"
        message="確定要重新抽籤嗎？目前結果將會全部清除。"
        confirmLabel="確定重抽"
        cancelLabel="取消"
        onConfirm={confirmResetAction}
        onCancel={cancelReset}
      />
    </div>
  )
}
