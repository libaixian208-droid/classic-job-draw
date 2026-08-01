import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../lib/api'
import { buildSpinFrames, formatFullResultsText, formatOwnResultText } from '../lib/jobs'
import { playComplete, playDrawSpin, playReveal } from '../lib/sfx'
import { shareOrDownloadResultCard } from '../lib/shareCard'
import {
  clearAuth,
  clearRoomFromUrl,
  loadAuth,
  readRoomFromUrl,
  readWatchFromUrl,
  saveAuth,
  writeRoomToUrl,
} from '../lib/storage'
import type { Job, PrivatePlayer, PublicSession } from '../types'
import { DEFAULT_JOBS } from '../lib/jobs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type Phase = 'loading' | 'lobby' | 'auth' | 'ready' | 'watch'

function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code.trim().toUpperCase())
}

export function useDrawGame() {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('loading')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [me, setMe] = useState<PrivatePlayer | null>(null)
  const [session, setSession] = useState<PublicSession | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [passcodeInput, setPasscodeInput] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([...DEFAULT_JOBS])
  const [authBusy, setAuthBusy] = useState(false)
  const [lobbyBusy, setLobbyBusy] = useState(false)
  const [hostBusy, setHostBusy] = useState(false)
  const [shareBusy, setShareBusy] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [spinJob, setSpinJob] = useState<Job | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmKickId, setConfirmKickId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )
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

  useEffect(() => {
    const onVisibility = () => {
      setTabVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const enterRoom = useCallback(
    (code: string, nextSession: PublicSession, watch = false) => {
      const normalized = code.trim().toUpperCase()
      setRoomCode(normalized)
      setSession(nextSession)
      writeRoomToUrl(normalized, watch)
      setPhase(watch ? 'watch' : 'auth')
      setError(null)
    },
    [],
  )

  const applyAuth = useCallback(
    (
      nextRoom: string,
      nextToken: string,
      nextMe: PrivatePlayer,
      nextSession: PublicSession,
    ) => {
      setRoomCode(nextRoom)
      setToken(nextToken)
      setMe(nextMe)
      setSession(nextSession)
      saveAuth(nextRoom, nextToken, nextMe.name)
      writeRoomToUrl(nextRoom, false)
      setPhase('ready')
      setError(null)
    },
    [],
  )

  const refreshPublic = useCallback(async (code: string) => {
    const res = await api.fetchSession(code)
    setSession(res.session)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const saved = loadAuth()
        const urlRoom = readRoomFromUrl()
        const watch = readWatchFromUrl()

        if (watch && urlRoom) {
          try {
            const res = await api.fetchSession(urlRoom)
            if (cancelled) return
            enterRoom(urlRoom, res.session, true)
            return
          } catch {
            if (cancelled) return
            clearRoomFromUrl()
            setError('找不到這個房間，請重新建立或加入')
            setPhase('lobby')
            return
          }
        }

        if (saved && !watch) {
          try {
            const res = await api.fetchMe(saved.roomCode, saved.token)
            if (cancelled) return
            applyAuth(saved.roomCode, saved.token, res.me, res.session)
            return
          } catch {
            clearAuth()
          }
        }

        if (urlRoom) {
          try {
            const res = await api.fetchSession(urlRoom)
            if (cancelled) return
            enterRoom(urlRoom, res.session, false)
            return
          } catch {
            if (cancelled) return
            clearRoomFromUrl()
            setError('找不到這個房間，請重新建立或加入')
            setPhase('lobby')
            return
          }
        }

        if (cancelled) return
        setPhase('lobby')
      } catch {
        if (cancelled) return
        setError('無法連線到伺服器，請檢查網路後再試')
        setPhase('lobby')
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [applyAuth, enterRoom])

  // Soft-refresh while logged in; pause when tab hidden.
  useEffect(() => {
    if (phase !== 'ready' || !token || !roomCode || !tabVisible) return
    const waitingReveal = Boolean(me?.job) && !session?.allDone
    const intervalMs = waitingReveal ? 3000 : 8000
    const id = window.setInterval(() => {
      void api
        .fetchMe(roomCode, token)
        .then((res) => {
          setMe(res.me)
          setSession(res.session)
        })
        .catch(() => {
          /* ignore transient errors */
        })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [phase, token, roomCode, me?.job, session?.allDone, tabVisible])

  // Watch-mode polling
  useEffect(() => {
    if (phase !== 'watch' || !roomCode || !tabVisible) return
    const intervalMs = session?.allDone ? 10000 : 4000
    const id = window.setInterval(() => {
      void api
        .fetchSession(roomCode)
        .then((res) => setSession(res.session))
        .catch(() => {
          /* ignore */
        })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [phase, roomCode, session?.allDone, tabVisible])

  const createRoom = useCallback(async () => {
    setLobbyBusy(true)
    setError(null)
    try {
      const res = await api.createRoom(selectedJobs)
      enterRoom(res.roomCode, res.session, false)
      showToast(`房間 ${res.roomCode}・${res.session.maxPlayers} 人`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '建立房間失敗')
    } finally {
      setLobbyBusy(false)
    }
  }, [selectedJobs, enterRoom, showToast])

  const joinRoom = useCallback(async () => {
    const code = roomInput.trim().toUpperCase()
    if (!isValidRoomCode(code)) {
      setError('房間代碼須為 6 碼英數')
      return
    }
    setLobbyBusy(true)
    setError(null)
    try {
      const res = await api.fetchSession(code)
      enterRoom(code, res.session, false)
      showToast(`已加入房間 ${code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加入房間失敗')
    } finally {
      setLobbyBusy(false)
    }
  }, [roomInput, enterRoom, showToast])

  const watchRoom = useCallback(async () => {
    const code = roomInput.trim().toUpperCase()
    if (!isValidRoomCode(code)) {
      setError('房間代碼須為 6 碼英數')
      return
    }
    setLobbyBusy(true)
    setError(null)
    try {
      const res = await api.fetchSession(code)
      enterRoom(code, res.session, true)
      showToast(`觀戰房間 ${code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '觀戰失敗')
    } finally {
      setLobbyBusy(false)
    }
  }, [roomInput, enterRoom, showToast])

  const enterWatchFromAuth = useCallback(() => {
    if (!roomCode || !session) return
    clearAuth()
    setToken(null)
    setMe(null)
    writeRoomToUrl(roomCode, true)
    setPhase('watch')
    showToast('已進入觀戰')
  }, [roomCode, session, showToast])

  const leaveRoom = useCallback(async () => {
    const code = roomCode
    const authToken = token
    clearTimers()
    if (code && authToken) {
      try {
        await api.leaveRoom(code, authToken)
      } catch {
        /* still clear local state */
      }
    }
    clearAuth()
    clearRoomFromUrl()
    setToken(null)
    setMe(null)
    setSession(null)
    setRoomCode(null)
    setDrawing(false)
    setSpinJob(null)
    setNameInput('')
    setPasscodeInput('')
    setError(null)
    setPhase('lobby')
    showToast('已離開房間並釋出名額')
  }, [clearTimers, roomCode, token, showToast])

  const handleRegister = useCallback(async () => {
    if (!roomCode) return
    if (!/^\d{4,8}$/.test(passcodeInput)) {
      setError('通行碼須為 4～8 位數字')
      return
    }
    setAuthBusy(true)
    setError(null)
    try {
      const res = await api.register(roomCode, nameInput, passcodeInput)
      applyAuth(roomCode, res.token, res.me, res.session)
      showToast('註冊成功！')
    } catch (e) {
      setError(e instanceof Error ? e.message : '註冊失敗')
    } finally {
      setAuthBusy(false)
    }
  }, [roomCode, nameInput, passcodeInput, applyAuth, showToast])

  const handleLogin = useCallback(async () => {
    if (!roomCode) return
    if (!/^\d{4,8}$/.test(passcodeInput)) {
      setError('通行碼須為 4～8 位數字')
      return
    }
    setAuthBusy(true)
    setError(null)
    try {
      const res = await api.login(roomCode, nameInput, passcodeInput)
      applyAuth(roomCode, res.token, res.me, res.session)
      showToast(`歡迎回來，${res.me.name}！`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '登入失敗')
    } finally {
      setAuthBusy(false)
    }
  }, [roomCode, nameInput, passcodeInput, applyAuth, showToast])

  const handleAuthEnter = useCallback(() => {
    const trimmed = nameInput.trim()
    if (!trimmed || authBusy) return
    if (!/^\d{4,8}$/.test(passcodeInput)) {
      setError('通行碼須為 4～8 位數字')
      return
    }
    const key = trimmed.toLowerCase()
    const exists = session?.players.some(
      (p) => p.name.trim().toLowerCase() === key,
    )
    if (exists) {
      void handleLogin()
      return
    }
    const full =
      (session?.registeredCount ?? 0) >= (session?.maxPlayers ?? 3)
    if (full) {
      setError('隊伍已滿；若你已註冊，請用相同名字與通行碼登入，或改為觀戰')
      return
    }
    void handleRegister()
  }, [nameInput, passcodeInput, authBusy, session, handleLogin, handleRegister])

  const logout = useCallback(() => {
    clearTimers()
    clearAuth()
    setToken(null)
    setMe(null)
    setDrawing(false)
    setSpinJob(null)
    setPhase('auth')
    if (roomCode) {
      writeRoomToUrl(roomCode, false)
      void refreshPublic(roomCode)
    }
    showToast('已切換帳號（座位仍保留）')
  }, [clearTimers, refreshPublic, roomCode, showToast])

  const draw = useCallback(async () => {
    if (!token || !roomCode || !me || me.job !== null || drawing) return
    setDrawing(true)
    setError(null)
    clearTimers()

    try {
      const res = await api.draw(roomCode, token)
      const finalJob = res.me.job
      if (!finalJob) throw new Error('抽籤失敗')

      setSession(res.session)

      const frames = buildSpinFrames(
        finalJob,
        reducedMotion,
        res.session.selectedJobs,
      )
      let cumulative = 0
      let lastSpinAt = -1

      await new Promise<void>((resolve) => {
        frames.forEach((frame, index) => {
          cumulative += frame.delayMs
          const timer = window.setTimeout(() => {
            setSpinJob(frame.job)
            if (index === 0 || cumulative - lastSpinAt > 180) {
              playDrawSpin()
              lastSpinAt = cumulative
            }
            if (index === frames.length - 1) {
              setMe(res.me)
              setDrawing(false)
              setSpinJob(null)
              playReveal()
              if (res.session.allDone) playComplete()
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
  }, [token, roomCode, me, drawing, reducedMotion, clearTimers])

  const requestReset = useCallback(() => {
    if (drawing || !me?.isHost) return
    setConfirmReset(true)
  }, [drawing, me?.isHost])

  const cancelReset = useCallback(() => setConfirmReset(false), [])

  const confirmResetAction = useCallback(async () => {
    if (!token || !roomCode) return
    setConfirmReset(false)
    try {
      const res = await api.resetRound(roomCode, token)
      setMe(res.me)
      setSession(res.session)
      showToast('已重新開始抽籤')
    } catch (e) {
      setError(e instanceof Error ? e.message : '重置失敗')
    }
  }, [token, roomCode, showToast])

  const updateJobs = useCallback(
    async (jobs: Job[]) => {
      if (!token || !roomCode) return
      setHostBusy(true)
      setError(null)
      try {
        const res = await api.updateJobs(roomCode, token, jobs)
        setMe(res.me)
        setSession(res.session)
        showToast(`職業池已更新・${res.session.maxPlayers} 人`)
      } catch (e) {
        setError(e instanceof Error ? e.message : '更新職業池失敗')
      } finally {
        setHostBusy(false)
      }
    },
    [token, roomCode, showToast],
  )

  const requestKick = useCallback((playerId: number) => {
    setConfirmKickId(playerId)
  }, [])

  const cancelKick = useCallback(() => setConfirmKickId(null), [])

  const confirmKickAction = useCallback(async () => {
    if (!token || !roomCode || confirmKickId === null) return
    const playerId = confirmKickId
    setConfirmKickId(null)
    setHostBusy(true)
    setError(null)
    try {
      const res = await api.kickPlayer(roomCode, token, playerId)
      setMe(res.me)
      setSession(res.session)
      showToast('已踢出玩家')
    } catch (e) {
      setError(e instanceof Error ? e.message : '踢出失敗')
    } finally {
      setHostBusy(false)
    }
  }, [token, roomCode, confirmKickId, showToast])

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

  const shareResults = useCallback(async () => {
    if (!roomCode || !session?.results?.length) return
    setShareBusy(true)
    try {
      const mode = await shareOrDownloadResultCard({
        roomCode,
        results: session.results,
      })
      showToast(mode === 'shared' ? '已開啟分享' : '結果圖已下載')
    } catch (e) {
      setError(e instanceof Error ? e.message : '分享失敗')
    } finally {
      setShareBusy(false)
    }
  }, [roomCode, session, showToast])

  const copyRoomLink = useCallback(async () => {
    if (!roomCode) return
    const url = new URL(window.location.href)
    url.searchParams.set('room', roomCode)
    if (phase === 'watch') url.searchParams.set('watch', '1')
    else url.searchParams.delete('watch')
    const text = url.toString()
    try {
      await navigator.clipboard.writeText(text)
      showToast(phase === 'watch' ? '觀戰連結已複製' : '房間連結已複製')
    } catch {
      showToast(`房間代碼：${roomCode}`)
    }
  }, [roomCode, phase, showToast])

  const kickTargetName =
    confirmKickId === null
      ? null
      : (session?.players.find((p) => p.id === confirmKickId)?.name ?? null)

  return {
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
    setError,
    confirmReset,
    confirmKickId,
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
  }
}
