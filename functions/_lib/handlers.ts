import {
  createEmptySession,
  nameKey,
  normalizeName,
  pickRandomJob,
  toPrivatePlayer,
  toPublicSession,
  type PlayerId,
  type SessionState,
  type StoredPlayer,
} from './session'

export interface SessionStore {
  load(): Promise<SessionState>
  save(session: SessionState): Promise<void>
}

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
  for (const id of [0, 1, 2] as PlayerId[]) {
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

async function handleSession(store: SessionStore): Promise<Response> {
  const session = await store.load()
  return json({ ok: true, session: toPublicSession(session) })
}

async function handleRegister(
  request: Request,
  store: SessionStore,
): Promise<Response> {
  const body = await readJson<{ name?: string }>(request)
  const name = normalizeName(body?.name ?? '')
  if (name.length < 1) return error('請輸入名字')
  if (name.length > 20) return error('名字最多 20 個字')

  const key = nameKey(name)
  const session = await store.load()
  if (findByNameKey(session, key)) {
    return error('這個名字已被註冊，請改用「登入」', 409)
  }
  if (session.players.length >= 3) {
    return error('已滿三人，無法再註冊', 409)
  }

  const id = nextPlayerId(session)
  if (id === null) return error('已滿三人，無法再註冊', 409)

  const player: StoredPlayer = {
    id,
    name,
    nameKey: key,
    job: null,
    token: crypto.randomUUID(),
  }
  session.players.push(player)
  session.players.sort((a, b) => a.id - b.id)
  await store.save(session)

  return json({
    ok: true,
    token: player.token,
    me: toPrivatePlayer(player),
    session: toPublicSession(session),
  })
}

async function handleLogin(
  request: Request,
  store: SessionStore,
): Promise<Response> {
  const body = await readJson<{ name?: string }>(request)
  const name = normalizeName(body?.name ?? '')
  if (name.length < 1) return error('請輸入名字')

  const session = await store.load()
  const player = findByNameKey(session, nameKey(name))
  if (!player) return error('找不到這個名字，請先註冊', 404)

  return json({
    ok: true,
    token: player.token,
    me: toPrivatePlayer(player),
    session: toPublicSession(session),
  })
}

async function handleMe(
  request: Request,
  store: SessionStore,
): Promise<Response> {
  const body = await readJson<{ token?: string }>(request)
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const session = await store.load()
  const player = findByToken(session, token)
  if (!player) return error('登入已失效，請重新登入', 401)

  return json({
    ok: true,
    me: toPrivatePlayer(player),
    session: toPublicSession(session),
  })
}

async function handleDraw(
  request: Request,
  store: SessionStore,
): Promise<Response> {
  const body = await readJson<{ token?: string }>(request)
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const session = await store.load()
  const player = findByToken(session, token)
  if (!player) return error('登入已失效，請重新登入', 401)
  if (player.job !== null) return error('你已經抽過籤了', 409)
  if (session.remainingJobs.length === 0) {
    return error('沒有剩餘職業', 409)
  }

  const { job, nextRemaining } = pickRandomJob(session.remainingJobs)
  player.job = job
  session.remainingJobs = nextRemaining
  await store.save(session)

  return json({
    ok: true,
    me: toPrivatePlayer(player),
    session: toPublicSession(session),
  })
}

async function handleReset(
  request: Request,
  store: SessionStore,
): Promise<Response> {
  const body = await readJson<{ token?: string }>(request)
  const token = body?.token?.trim() ?? ''
  if (!token) return error('未登入', 401)

  const session = await store.load()
  const player = findByToken(session, token)
  if (!player) return error('登入已失效，請重新登入', 401)

  for (const p of session.players) {
    p.job = null
  }
  session.remainingJobs = ['槍騎兵', '僧侶', '冰雷巫師']
  await store.save(session)

  return json({
    ok: true,
    me: toPrivatePlayer(player),
    session: toPublicSession(session),
  })
}

/** Route `/api/<path>` against a session store. */
export async function handleApiRequest(
  request: Request,
  path: string,
  store: SessionStore,
): Promise<Response> {
  const method = request.method.toUpperCase()

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (path === 'session' && method === 'GET') return handleSession(store)
  if (path === 'register' && method === 'POST') {
    return handleRegister(request, store)
  }
  if (path === 'login' && method === 'POST') return handleLogin(request, store)
  if (path === 'me' && method === 'POST') return handleMe(request, store)
  if (path === 'draw' && method === 'POST') return handleDraw(request, store)
  if (path === 'reset' && method === 'POST') return handleReset(request, store)
  return error('找不到 API', 404)
}

export function createMemoryStore(
  initial: SessionState = createEmptySession(),
): SessionStore {
  let state = initial
  return {
    async load() {
      return structuredClone(state)
    },
    async save(session) {
      state = {
        ...structuredClone(session),
        updatedAt: new Date().toISOString(),
      }
    },
  }
}
