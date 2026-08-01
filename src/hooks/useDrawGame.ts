import { useCallback, useEffect, useRef, useState } from 'react'
import {
  buildSpinFrames,
  displayName,
  formatShareText,
  pickRandomJob,
} from '../lib/jobs'
import {
  createInitialState,
  loadState,
  saveState,
} from '../lib/storage'
import type { Job, PersistedState, PlayerId } from '../types'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useDrawGame() {
  const reducedMotion = usePrefersReducedMotion()
  const [state, setState] = useState<PersistedState>(() => loadState())
  const [drawingPlayerId, setDrawingPlayerId] = useState<PlayerId | null>(null)
  const [spinJob, setSpinJob] = useState<Job | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const timersRef = useRef<number[]>([])
  const toastTimerRef = useRef<number | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 2200)
  }, [])

  const isLocked = drawingPlayerId !== null
  const allDone = state.players.every((p) => p.job !== null)

  const setPlayerName = useCallback((id: PlayerId, name: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id ? { ...p, name } : p,
      ),
    }))
  }, [])

  const drawForPlayer = useCallback(
    (id: PlayerId) => {
      const player = state.players.find((p) => p.id === id)
      if (!player || player.job !== null || isLocked) return
      if (state.remainingJobs.length === 0) return

      const { job, nextRemaining } = pickRandomJob(state.remainingJobs)
      setDrawingPlayerId(id)
      clearTimers()

      const frames = buildSpinFrames(job, reducedMotion)
      let cumulative = 0

      frames.forEach((frame, index) => {
        cumulative += frame.delayMs
        const timer = window.setTimeout(() => {
          setSpinJob(frame.job)
          const isLast = index === frames.length - 1
          if (isLast) {
            setState((prev) => ({
              ...prev,
              remainingJobs: nextRemaining,
              players: prev.players.map((p) =>
                p.id === id ? { ...p, job } : p,
              ),
            }))
            setDrawingPlayerId(null)
            setSpinJob(null)
          }
        }, cumulative)
        timersRef.current.push(timer)
      })
    },
    [state.players, state.remainingJobs, isLocked, reducedMotion, clearTimers],
  )

  const requestReset = useCallback(() => {
    if (isLocked) return
    setConfirmReset(true)
  }, [isLocked])

  const cancelReset = useCallback(() => {
    setConfirmReset(false)
  }, [])

  const confirmResetAction = useCallback(() => {
    clearTimers()
    setDrawingPlayerId(null)
    setSpinJob(null)
    setConfirmReset(false)
    setState((prev) => {
      const next = createInitialState()
      next.players = next.players.map((p, i) => ({
        ...p,
        name: prev.players[i]?.name ?? '',
      }))
      return next
    })
  }, [clearTimers])

  const copyResults = useCallback(async () => {
    if (!allDone) return
    const lines = state.players.map((p) => ({
      name: displayName(p.name, p.id),
      job: p.job!,
    }))
    const text = formatShareText(lines)

    try {
      await navigator.clipboard.writeText(text)
      showToast('結果已複製！')
    } catch {
      // Fallback for older browsers / insecure context.
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        showToast('結果已複製！')
      } catch {
        showToast('複製失敗，請手動選取文字')
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }, [allDone, state.players, showToast])

  return {
    players: state.players,
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
    dismissToast: () => setToast(null),
  }
}
