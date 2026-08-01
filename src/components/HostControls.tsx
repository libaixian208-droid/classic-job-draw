import { useEffect, useState } from 'react'
import { JobPicker } from './JobPicker'
import { MIN_PLAYERS, MAX_PLAYERS, type Job } from '../lib/jobs'
import { playClick } from '../lib/sfx'
import type { PublicPlayer, PublicSession } from '../types'

interface HostControlsProps {
  session: PublicSession
  myId: number
  busy: boolean
  onUpdateJobs: (jobs: Job[]) => void
  onKick: (playerId: number) => void
}

export function HostControls({
  session,
  myId,
  busy,
  onUpdateJobs,
  onKick,
}: HostControlsProps) {
  const [draftJobs, setDraftJobs] = useState<Job[]>(session.selectedJobs)
  const [editing, setEditing] = useState(false)
  const anyoneDrawn = session.drawnCount > 0
  const dirty =
    draftJobs.length !== session.selectedJobs.length ||
    draftJobs.some((j) => !session.selectedJobs.includes(j))
  const canSave =
    !busy &&
    !anyoneDrawn &&
    dirty &&
    draftJobs.length >= Math.max(MIN_PLAYERS, session.registeredCount) &&
    draftJobs.length <= MAX_PLAYERS

  useEffect(() => {
    setDraftJobs(session.selectedJobs)
  }, [session.selectedJobs])

  return (
    <div className="host-controls">
      <div className="host-controls__head">
        <h3 className="host-controls__title">房主管理</h3>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy || anyoneDrawn}
          onClick={() => {
            playClick()
            setEditing((v) => !v)
            setDraftJobs(session.selectedJobs)
          }}
        >
          {editing ? '收合職業池' : '編輯職業池'}
        </button>
      </div>

      {anyoneDrawn ? (
        <p className="host-controls__hint">
          已有人抽籤；若要改職業池，請先「重新抽籤」。
        </p>
      ) : null}

      {editing && !anyoneDrawn ? (
        <div className="host-controls__editor">
          <JobPicker
            selectedJobs={draftJobs}
            onSelectedJobsChange={setDraftJobs}
            disabled={busy}
            compact
          />
          {draftJobs.length < session.registeredCount ? (
            <p className="room-lobby__warn">
              職業數不可少於已註冊人數（{session.registeredCount}）
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() => {
              playClick()
              onUpdateJobs(draftJobs)
            }}
          >
            {busy ? '更新中…' : '套用職業池'}
          </button>
        </div>
      ) : null}

      <ul className="host-controls__kick-list" aria-label="踢出玩家">
        {session.players
          .filter((p: PublicPlayer) => p.id !== myId)
          .map((p) => (
            <li key={p.id}>
              <span>
                {p.name}
                {p.isHost ? '（房主）' : ''}
                {p.hasDrawn ? ' · 已抽' : ''}
              </span>
              <button
                type="button"
                className="btn btn-secondary host-controls__kick"
                disabled={busy}
                onClick={() => {
                  playClick()
                  onKick(p.id)
                }}
              >
                踢出
              </button>
            </li>
          ))}
      </ul>
      {session.players.length <= 1 ? (
        <p className="host-controls__hint">目前沒有其他玩家可踢出。</p>
      ) : null}
    </div>
  )
}
