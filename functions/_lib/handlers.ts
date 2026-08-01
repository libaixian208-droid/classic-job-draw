import {
  hashPasscode,
  isValidPasscode,
  normalizePasscode,
  verifyPasscode,
} from './passcode'
import { enforceRateLimit } from './rateLimit'
import {
  isValidRoomCode,
  nameKey,
  normalizeJobList,
  normalizeName,
  normalizeRoomCode,
  pickRandomJob,
  toPrivatePlayer,
  toPublicSession,
  type PlayerId,
  type SessionState,
  type StoredPlayer,
} from './session'
import {
  createRoom,
  loadRoom,
  mutateRoom,
  type Env,
} from './store'

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function error(message: string, status = 400): Response {
  return json({ ok: false, error: message }, status)
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

function nextPlayerId(session: SessionState): PlayerId | null {
  const used = new Set(session.players.map((p) => p.id))
  for (let id = 0; id < session.maxPlayers; id++) {
    if (!used.has(id)) return id
  }
  return null
}

function findByToken(
  session: SessionState,
  token: string,
): StoredPlayer | undefined {
  return session.players.find((p) => p.token === token)
}

function findByNameKey(
  session: SessionState,
  key: string,
): StoredPlayer | undefined {
  return session.players.find((p) => p.nameKey === key)
}

function requireRoom(raw: unknown): string | Response {
  if (typeof raw !== 'string') return error('請提供房間代碼')
  const code = normalizeRoomCode(raw)
  if (!isValidRoomCode(code)) return error('房間代碼須為 6 碼')
  return code
}

function requirePasscode(raw: unknown): string | Response {
  const pin = normalizePasscode(raw)
  if (!isValidPasscode(pin)) {
    return error('通行碼須為 4～8 位數字')
  }
  return pin
}

function authPayload(session: SessionState, player: StoredPlayer) {
  return {
    ok: true as const,
    token: player.token,
    me: toPrivatePlayer(player, session),
    session: toPublicSession(session),
  }
}

function reindexPlayers(session: SessionState): void {
  session.players.sort((a, b) => a.id - b.id)
  const hostToken =
    session.hostPlayerId === null
      ? null
      : session.players.find((p) => p.id === session.hostPlayerId)?.token ?? null
  session.players.forEach((p, i) => {
    p.id = i
  })
  if (hostToken) {
    const host = session.players.find((p) => p.token === hostToken)
    session.hostPlayerId = host?.id ?? session.players[0]?.id ?? null
  } else if (session.players[0]) {
    session.hostPlayerId = session.players[0].id
  } else {
    session.hostPlayerId = null
  }
}

/** Remove a seat: return job to pool, reindex, hand off host if needed. */
function removePlayer(session: SessionState, playerId: number): boolean {
  const target = session.players.find((p) => p.id === playerId)
  if (!target) return false
  if (target.job !== null) {
    session.remainingJobs = [...session.remainingJobs, target.job]
  }
  if (session.hostPlayerId === target.id) {
    session.hostPlayerId = null
  }
  session.players = session.players.filter((p) => p.id !== target.id)
  reindexPlayers(session)
  return true
}

async function handleCreateRoom(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'rooms', 8, 600)
  if (limited) return limited

  const body = await readJson<{ jobs?: unknown }>(request)
  const jobs = normalizeJobList(body?.jobs)
  if (!jobs) {
    return error('請選擇 2～12 個不重複的經典版職業')
  }

  try {
    const session = await createRoom(env.DRAW_KV, jobs)
    return json({
      ok: true,
      roomCode: session.roomCode,
      session: toPublicSession(session),
    })
  } catch {
    return error('無法建立房間，請稍後再試', 503)
  }
}

async function handleSession(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'session', 120, 600)
  if (limited) return limited

  const url = new URL(request.url)
  const room = requireRoom(url.searchParams.get('room') ?? '')
  if (room instanceof Response) return room

  const session = await loadRoom(env.DRAW_KV, room)
  if (!session) return error('找不到這個房間', 404)
  return json({ ok: true, session: toPublicSession(session) })
}

async function handleRegister(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'auth', 30, 600)
  if (limited) return limited

  const body = await readJson<{
    name?: string
    room?: string
    passcode?: string
  }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room

  const name = normalizeName(body?.name ?? '')
  if (name.length < 1) return error('請輸入名字')
  if (name.length > 20) return error('名字最多 20 個字')
  const pin = requirePasscode(body?.passcode)
  if (pin instanceof Response) return pin
  const key = nameKey(name)
  const passcodeHash = await hashPasscode(pin)

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    if (findByNameKey(session, key)) {
      return { ok: false, error: '這個名字已被註冊，請改用「登入」', status: 409 }
    }
    if (session.players.length >= session.maxPlayers) {
      return {
        ok: false,
        error: `已滿 ${session.maxPlayers} 人，無法再註冊`,
        status: 409,
      }
    }
    const id = nextPlayerId(session)
    if (id === null) {
      return {
        ok: false,
        error: `已滿 ${session.maxPlayers} 人，無法再註冊`,
        status: 409,
      }
    }

    const player: StoredPlayer = {
      id,
      name,
      nameKey: key,
      job: null,
      token: crypto.randomUUID(),
      passcodeHash,
    }
    session.players.push(player)
    session.players.sort((a, b) => a.id - b.id)
    if (session.hostPlayerId === null) {
      session.hostPlayerId = player.id
    }
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  const player = findByNameKey(outcome.session, key)
  if (!player) return error('註冊失敗', 500)
  return json(authPayload(outcome.session, player))
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'auth', 30, 600)
  if (limited) return limited

  const body = await readJson<{
    name?: string
    room?: string
    passcode?: string
  }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room

  const name = normalizeName(body?.name ?? '')
  if (name.length < 1) return error('請輸入名字')
  const pin = requirePasscode(body?.passcode)
  if (pin instanceof Response) return pin
  const key = nameKey(name)

  const session = await loadRoom(env.DRAW_KV, room)
  if (!session) return error('找不到這個房間', 404)
  const existing = findByNameKey(session, key)
  if (!existing) return error('找不到這個名字，請先註冊', 404)

  const verified = await verifyPasscode(pin, existing.passcodeHash)
  if (verified === 'mismatch') {
    return error('通行碼錯誤', 401)
  }

  if (verified === 'set') {
    const passcodeHash = await hashPasscode(pin)
    const upgraded = await mutateRoom(env.DRAW_KV, room, (next) => {
      const target = findByNameKey(next, key)
      if (!target) {
        return { ok: false, error: '找不到這個名字，請先註冊', status: 404 }
      }
      if (target.passcodeHash) {
        return { ok: false, error: '通行碼錯誤', status: 401 }
      }
      target.passcodeHash = passcodeHash
      target.token = crypto.randomUUID()
      return { ok: true, session: next }
    })
    if (!upgraded.ok) return error(upgraded.error, upgraded.status)
    const player = findByNameKey(upgraded.session, key)
    if (!player) return error('登入失敗', 500)
    return json(authPayload(upgraded.session, player))
  }

  return json(authPayload(session, existing))
}

async function handleMe(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'me', 180, 600)
  if (limited) return limited

  const body = await readJson<{ token?: string; room?: string }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const session = await loadRoom(env.DRAW_KV, room)
  if (!session) return error('找不到這個房間', 404)
  const player = findByToken(session, token)
  if (!player) return error('登入已失效，請重新登入', 401)
  return json(authPayload(session, player))
}

async function handleDraw(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'draw', 60, 600)
  if (limited) return limited

  const body = await readJson<{ token?: string; room?: string }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  let drawnPlayer: StoredPlayer | null = null

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    const player = findByToken(session, token)
    if (!player) {
      return { ok: false, error: '登入已失效，請重新登入', status: 401 }
    }
    if (player.job !== null) {
      return { ok: false, error: '你已經抽過籤了', status: 409 }
    }
    if (session.remainingJobs.length === 0) {
      return { ok: false, error: '沒有剩餘職業', status: 409 }
    }

    const { job, nextRemaining } = pickRandomJob(session.remainingJobs)
    player.job = job
    session.remainingJobs = nextRemaining
    drawnPlayer = player
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  const player = drawnPlayer ?? findByToken(outcome.session, token)
  if (!player) return error('抽籤失敗', 500)
  return json(authPayload(outcome.session, player))
}

async function handleReset(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'mutate', 40, 600)
  if (limited) return limited

  const body = await readJson<{ token?: string; room?: string }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    const player = findByToken(session, token)
    if (!player) {
      return { ok: false, error: '登入已失效，請重新登入', status: 401 }
    }
    if (session.hostPlayerId !== player.id) {
      return {
        ok: false,
        error: '只有房主可以重新抽籤',
        status: 403,
      }
    }

    for (const p of session.players) {
      p.job = null
    }
    session.remainingJobs = [...session.selectedJobs]
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  const player = findByToken(outcome.session, token)
  if (!player) return error('重置失敗', 500)
  return json(authPayload(outcome.session, player))
}

async function handleUpdateJobs(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'mutate', 40, 600)
  if (limited) return limited

  const body = await readJson<{ token?: string; room?: string; jobs?: unknown }>(
    request,
  )
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)
  const jobs = normalizeJobList(body?.jobs)
  if (!jobs) return error('請選擇 2～12 個不重複的經典版職業')

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    const player = findByToken(session, token)
    if (!player) {
      return { ok: false, error: '登入已失效，請重新登入', status: 401 }
    }
    if (session.hostPlayerId !== player.id) {
      return { ok: false, error: '只有房主可以修改職業池', status: 403 }
    }
    if (session.players.some((p) => p.job !== null)) {
      return {
        ok: false,
        error: '已有人抽籤，請先「重新抽籤」再改職業池',
        status: 409,
      }
    }
    if (jobs.length < session.players.length) {
      return {
        ok: false,
        error: `職業數不可少於已註冊人數（目前 ${session.players.length} 人）`,
        status: 409,
      }
    }

    session.selectedJobs = [...jobs]
    session.maxPlayers = jobs.length
    session.remainingJobs = [...jobs]
    reindexPlayers(session)
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  const player = findByToken(outcome.session, token)
  if (!player) return error('更新失敗', 500)
  return json(authPayload(outcome.session, player))
}

async function handleKick(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'mutate', 40, 600)
  if (limited) return limited

  const body = await readJson<{
    token?: string
    room?: string
    playerId?: number
  }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)
  if (typeof body?.playerId !== 'number') return error('請指定要踢出的玩家')
  const playerId = body.playerId

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    const host = findByToken(session, token)
    if (!host) {
      return { ok: false, error: '登入已失效，請重新登入', status: 401 }
    }
    if (session.hostPlayerId !== host.id) {
      return { ok: false, error: '只有房主可以踢人', status: 403 }
    }
    if (playerId === host.id) {
      return { ok: false, error: '不能踢出自己，請改用「離開房間」', status: 400 }
    }
    if (!removePlayer(session, playerId)) {
      return { ok: false, error: '找不到這位冒險者', status: 404 }
    }
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  const player = findByToken(outcome.session, token)
  if (!player) return error('踢出失敗', 500)
  return json(authPayload(outcome.session, player))
}

async function handleLeave(request: Request, env: Env): Promise<Response> {
  const limited = await enforceRateLimit(request, env.DRAW_KV, 'mutate', 40, 600)
  if (limited) return limited

  const body = await readJson<{ token?: string; room?: string }>(request)
  const room = requireRoom(body?.room ?? '')
  if (room instanceof Response) return room
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const outcome = await mutateRoom(env.DRAW_KV, room, (session) => {
    const player = findByToken(session, token)
    if (!player) {
      return { ok: false, error: '登入已失效，請重新登入', status: 401 }
    }
    if (!removePlayer(session, player.id)) {
      return { ok: false, error: '離開失敗', status: 500 }
    }
    return { ok: true, session }
  })

  if (!outcome.ok) return error(outcome.error, outcome.status)
  return json({
    ok: true as const,
    session: toPublicSession(outcome.session),
  })
}

export async function handleApiRequest(
  request: Request,
  path: string,
  env: Env,
): Promise<Response> {
  const method = request.method.toUpperCase()

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    if (path === 'rooms' && method === 'POST') {
      return await handleCreateRoom(request, env)
    }
    if (path === 'session' && method === 'GET') {
      return await handleSession(request, env)
    }
    if (path === 'register' && method === 'POST') {
      return await handleRegister(request, env)
    }
    if (path === 'login' && method === 'POST') {
      return await handleLogin(request, env)
    }
    if (path === 'me' && method === 'POST') {
      return await handleMe(request, env)
    }
    if (path === 'draw' && method === 'POST') {
      return await handleDraw(request, env)
    }
    if (path === 'reset' && method === 'POST') {
      return await handleReset(request, env)
    }
    if (path === 'jobs' && method === 'POST') {
      return await handleUpdateJobs(request, env)
    }
    if (path === 'kick' && method === 'POST') {
      return await handleKick(request, env)
    }
    if (path === 'leave' && method === 'POST') {
      return await handleLeave(request, env)
    }
    return error('找不到 API', 404)
  } catch (err) {
    console.error(err)
    return error('伺服器錯誤，請稍後再試', 500)
  }
}

/** In-memory multi-room store for local Vite middleware. */
export function createMemoryEnv(): Env {
  const data = new Map<string, { value: string; until?: number }>()

  const kv = {
    async get(key: string): Promise<string | null> {
      const row = data.get(key)
      if (!row) return null
      if (row.until && row.until < Date.now()) {
        data.delete(key)
        return null
      }
      return row.value
    },
    async put(
      key: string,
      value: string,
      options?: { expirationTtl?: number },
    ): Promise<void> {
      const until = options?.expirationTtl
        ? Date.now() + options.expirationTtl * 1000
        : undefined
      data.set(key, { value, until })
    },
    async delete(key: string): Promise<void> {
      data.delete(key)
    },
  }

  return { DRAW_KV: kv as unknown as KVNamespace }
}
