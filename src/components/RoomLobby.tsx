import { useState } from 'react'
import {
  DEFAULT_JOBS,
  JOB_CATEGORIES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Job,
} from '../lib/jobs'
import { JobPicker } from './JobPicker'

interface RoomLobbyProps {
  roomInput: string
  onRoomInputChange: (value: string) => void
  selectedJobs: Job[]
  onSelectedJobsChange: (jobs: Job[]) => void
  onCreate: () => void
  onJoin: () => void
  onWatch: () => void
  busy: boolean
  error: string | null
}

export function RoomLobby({
  roomInput,
  onRoomInputChange,
  selectedJobs,
  onSelectedJobsChange,
  onCreate,
  onJoin,
  onWatch,
  busy,
  error,
}: RoomLobbyProps) {
  const [showJobs, setShowJobs] = useState(true)
  const canJoin = roomInput.trim().length >= 6 && !busy
  const playerCount = selectedJobs.length
  const canCreate =
    !busy && playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS

  return (
    <section className="room-lobby rpg-frame" aria-labelledby="lobby-heading">
      <div className="rpg-frame__corners" aria-hidden="true" />
      <h2 id="lobby-heading" className="room-lobby__title">
        選擇抽籤房間
      </h2>
      <p className="room-lobby__desc">
        開房時勾選經典版職業；人數等於勾選數，每人抽到不重複職業。也可只輸入代碼觀戰。
      </p>

      <div className="room-lobby__setup">
        <div className="room-lobby__setup-head">
          <h3 className="room-lobby__setup-title">開房設定</h3>
        </div>

        <div className="room-lobby__presets">
          <button
            type="button"
            className="btn btn-secondary room-lobby__preset"
            disabled={busy}
            onClick={() => onSelectedJobsChange([...DEFAULT_JOBS])}
          >
            預設三人組
          </button>
          <button
            type="button"
            className="btn btn-secondary room-lobby__preset"
            disabled={busy}
            onClick={() =>
              onSelectedJobsChange(JOB_CATEGORIES.flatMap((c) => c.jobs))
            }
          >
            全選 12 職
          </button>
          <button
            type="button"
            className="btn btn-secondary room-lobby__preset"
            disabled={busy}
            onClick={() => setShowJobs((v) => !v)}
          >
            {showJobs ? '收合職業' : '展開職業'}
          </button>
        </div>

        {showJobs ? (
          <JobPicker
            selectedJobs={selectedJobs}
            onSelectedJobsChange={onSelectedJobsChange}
            disabled={busy}
          />
        ) : (
          <p className="room-lobby__selected-summary">
            已選：{selectedJobs.join('、') || '尚未選擇'}（{playerCount} 人）
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-primary room-lobby__create"
        disabled={!canCreate}
        onClick={onCreate}
      >
        {busy ? '開房中…' : `建立房間（${playerCount} 人）`}
      </button>

      <div className="room-lobby__divider" aria-hidden="true">
        或加入／觀戰既有房間
      </div>

      <div className="room-lobby__field">
        <label htmlFor="room-code">房間代碼</label>
        <input
          id="room-code"
          type="text"
          className="player-card__input"
          placeholder="例如：A3K9P2"
          value={roomInput}
          maxLength={6}
          disabled={busy}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) =>
            onRoomInputChange(
              e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
            )
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canJoin) onJoin()
          }}
        />
      </div>

      {error ? (
        <p className="auth-panel__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="room-lobby__join-row">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canJoin}
          onClick={onJoin}
        >
          加入房間
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canJoin}
          onClick={onWatch}
        >
          觀戰
        </button>
      </div>
    </section>
  )
}
