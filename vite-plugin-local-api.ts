import type { Plugin } from 'vite'

type Job = '槍騎兵' | '僧侶' | '冰雷巫師'
const JOBS: Job[] = ['槍騎兵', '僧侶', '冰雷巫師']

interface Player {
  id: 0 | 1 | 2
  name: string
  nameKey: string
  job: Job | null
  token: string
}

interface Session {
  players: Player[]
  remainingJobs: Job[]
}

function createSession(): Session {
  return { players: [], remainingJobs: [...JOBS] }
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function toPublic(session: Session) {
  return {
    registeredCount: session.players.length,
    maxPlayers: 3,
    drawnCount: session.players.filter((p) => p.job !== null).length,
    allDone:
      session.players.length === 3 &&
      session.players.every((p) => p.job !== null),
    players: session.players.map((p) => ({
      id: p.id,
      name: p.name,
      hasDrawn: p.job !== null,
    })),
  }
}

function toMe(p: Player) {
  return { id: p.id, name: p.name, job: p.job }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function err(message: string, status = 400): Response {
  return json({ ok: false, error: message }, status)
}

/** In-memory /api for local `vite` so register/login works without wrangler. */
export function localDrawApi(): Plugin {
  let session = createSession()

  return {
    name: 'local-draw-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) {
          next()
          return
        }

        const path = url.replace(/^\/api\//, '').split('?')[0] ?? ''
        const chunks: Buffer[] = []

        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', () => {
          void (async () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf8')
              const body = raw ? (JSON.parse(raw) as Record<string, string>) : {}
              const method = (req.method ?? 'GET').toUpperCase()
              let response: Response

              if (path === 'session' && method === 'GET') {
                response = json({ ok: true, session: toPublic(session) })
              } else if (path === 'register' && method === 'POST') {
                const name = normalizeName(body.name ?? '')
                const key = name.toLowerCase()
                if (!name) response = err('請輸入名字')
                else if (name.length > 20) response = err('名字最多 20 個字')
                else if (session.players.some((p) => p.nameKey === key)) {
                  response = err('這個名字已被註冊，請改用「登入」', 409)
                } else if (session.players.length >= 3) {
                  response = err('已滿三人，無法再註冊', 409)
                } else {
                  const used = new Set(session.players.map((p) => p.id))
                  const id = ([0, 1, 2] as const).find((n) => !used.has(n))
                  if (id === undefined) {
                    response = err('已滿三人，無法再註冊', 409)
                  } else {
                    const player: Player = {
                      id,
                      name,
                      nameKey: key,
                      job: null,
                      token: crypto.randomUUID(),
                    }
                    session.players.push(player)
                    session.players.sort((a, b) => a.id - b.id)
                    response = json({
                      ok: true,
                      token: player.token,
                      me: toMe(player),
                      session: toPublic(session),
                    })
                  }
                }
              } else if (path === 'login' && method === 'POST') {
                const name = normalizeName(body.name ?? '')
                const player = session.players.find(
                  (p) => p.nameKey === name.toLowerCase(),
                )
                response = !name
                  ? err('請輸入名字')
                  : !player
                    ? err('找不到這個名字，請先註冊', 404)
                    : json({
                        ok: true,
                        token: player.token,
                        me: toMe(player),
                        session: toPublic(session),
                      })
              } else if (path === 'me' && method === 'POST') {
                const player = session.players.find((p) => p.token === body.token)
                response = !body.token
                  ? err('未登入', 401)
                  : !player
                    ? err('登入已失效，請重新登入', 401)
                    : json({
                        ok: true,
                        me: toMe(player),
                        session: toPublic(session),
                      })
              } else if (path === 'draw' && method === 'POST') {
                const player = session.players.find((p) => p.token === body.token)
                if (!body.token) response = err('未登入', 401)
                else if (!player) response = err('登入已失效，請重新登入', 401)
                else if (player.job !== null) response = err('你已經抽過籤了', 409)
                else if (session.remainingJobs.length === 0) {
                  response = err('沒有剩餘職業', 409)
                } else {
                  const index = Math.floor(
                    Math.random() * session.remainingJobs.length,
                  )
                  const job = session.remainingJobs[index]!
                  player.job = job
                  session.remainingJobs = session.remainingJobs.filter(
                    (_, i) => i !== index,
                  )
                  response = json({
                    ok: true,
                    me: toMe(player),
                    session: toPublic(session),
                  })
                }
              } else if (path === 'reset' && method === 'POST') {
                const player = session.players.find((p) => p.token === body.token)
                if (!body.token) response = err('未登入', 401)
                else if (!player) response = err('登入已失效，請重新登入', 401)
                else {
                  for (const p of session.players) p.job = null
                  session.remainingJobs = [...JOBS]
                  response = json({
                    ok: true,
                    me: toMe(player),
                    session: toPublic(session),
                  })
                }
              } else {
                response = err('找不到 API', 404)
              }

              res.statusCode = response.status
              response.headers.forEach((value, key) => {
                res.setHeader(key, value)
              })
              res.end(await response.text())
            } catch (e) {
              console.error(e)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: '本機 API 錯誤' }))
            }
          })()
        })
      })
    },
  }
}
