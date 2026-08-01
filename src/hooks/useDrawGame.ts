import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../lib/api'
import { buildSpinFrames, formatFullResultsText, formatOwnResultText } from '../lib/jobs'
import { clearAuth, loadAuth, saveAuth } from '../lib/storage'
import type { Job, PrivatePlayer, PublicSession } from '../types'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type Phase = 'loading' | 'auth' | 'ready'

export function useDrawGame() {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [me, setMe] = useState<PrivatePlayer | null>(null)
  const [session, setSession] = useState<PublicSession | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [spinJob, setSpinJob] = useState<Job | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timersRef = useRef<number[]>([])
  const toastTimerRef = useRef<number | null>(null)

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

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      clearTimers()
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [clearTimers])

  const applyAuth = useCallback(
    (nextToken: string, nextMe: PrivatePlayer, nextSession: PublicSession) => {
      setToken(nextToken)
      setMe(nextMe)
      setSession(nextSession)
      saveAuth(nextToken, nextMe.name)
      setPhase('ready')
      setError(null)
    },
    [],
  )

  const refreshPublic = useCallback(async () => {
    const res = await api.fetchSession()
    setSession(res.session)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const saved = loadAuth()
        if (saved) {
          try {
            const res = await api.fetchMe(saved.token)
            if (cancelled) return
            applyAuth(saved.token, res.me, res.session)
            return
          } catch {
            clearAuth()
          }
        }
        const publicSession = await api.fetchSession()
        if (cancelled) return
        setSession(publicSession.session)
        setPhase('auth')
      } catch {
        if (cancelled) return
        setError('無法連線到伺服器，請稍後再試')
        setPhase('auth')
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [applyAuth])

  // Soft-refresh while logged in; poll faster while waiting for full reveal.
  useEffect(() => {
    if (phase !== 'ready' || !token) return
    const waitingReveal = Boolean(me?.job) && !session?.allDone
    const intervalMs = waitingReveal ? 3000 : 8000
    const id = window.setInterval(() => {
      void api
        .fetchMe(token)
        .then((res) => {
          setMe(res.me)
          setSession(res.session)
        })
        .catch(() => {
          /* ignore transient errors */
        })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [phase, token, me?.job, session?.allDone])

  const handleRegister = useCallback(async () => {
    setAuthBusy(true)
    setError(null)
    try {
      const res = await api.register(nameInput)
      applyAuth(res.token, res.me, res.session)
      showToast('註冊成功！')
    } catch (e) {
      setError(e instanceof Error ? e.message : '註冊失敗')
    } finally {
      setAuthBusy(false)
    }
  }, [nameInput, applyAuth, showToast])

  const handleLogin = useCallback(async () => {
    setAuthBusy(true)
    setError(null)
    try {
      const res = await api.login(nameInput)
      applyAuth(res.token, res.me, res.session)
      showToast(`歡迎回來，${res.me.name}！`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '登入失敗')
    } finally {
      setAuthBusy(false)
    }
  }, [nameInput, applyAuth, showToast])

  const logout = useCallback(() => {
    clearTimers()
    clearAuth()
    setToken(null)
    setMe(null)
    setDrawing(false)
    setSpinJob(null)
    setPhase('auth')
    void refreshPublic()
  }, [clearTimers, refreshPublic])

  const draw = useCallback(async () => {
    if (!token || !me || me.job !== null || drawing) return
    setDrawing(true)
    setError(null)
    clearTimers()

    try {
      const res = await api.draw(token)
      const finalJob = res.me.job
      if (!finalJob) throw new Error('抽籤失敗')

      // Keep public session (without revealing others' jobs).
      setSession(res.session)

      const frames = buildSpinFrames(finalJob, reducedMotion)
      let cumulative = 0

      await new Promise<void>((resolve) => {
        frames.forEach((frame, index) => {
          cumulative += frame.delayMs
          const timer = window.setTimeout(() => {
            setSpinJob(frame.job)
            if (index === frames.length - 1) {
              setMe(res.me)
              setDrawing(false)
              setSpinJob(null)
              resolve()
            }
          }, cumulative)
          timersRef.current.push(timer)
        })
      })
    } catch (e) {
      setDrawing(false)
      setSpinJob(null)
      setError(e instanceof Error ? e.message : '抽籤失敗')
    }
  }, [token, me, drawing, reducedMotion, clearTimers])

  const requestReset = useCallback(() => {
    if (drawing) return
    setConfirmReset(true)
  }, [drawing])

  const cancelReset = useCallback(() => setConfirmReset(false), [])

  const confirmResetAction = useCallback(async () => {
    if (!token) return
    setConfirmReset(false)
    try {
      const res = await api.resetRound(token)
      setMe(res.me)
      setSession(res.session)
      showToast('已重新開始抽籤')
    } catch (e) {
      setError(e instanceof Error ? e.message : '重置失敗')
    }
  }, [token, showToast])

  const copyResults = useCallback(async () => {
    if (!me?.job) return
    const text =
      session?.allDone && session.results && session.results.length > 0
        ? formatFullResultsText(session.results)
        : formatOwnResultText(me.name, me.job)
    try {
      await navigator.clipboard.writeText(text)
      showToast('結果已複製！')
    } catch {
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
  }, [me, session, showToast])

  return {
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
    setError,
    confirmReset,
    handleRegister,
    handleLogin,
    logout,
    draw,
    requestReset,
    cancelReset,
    confirmResetAction,
    copyResults,
  }
}
