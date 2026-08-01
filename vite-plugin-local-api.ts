import type { Plugin } from 'vite'
import { createMemoryEnv, handleApiRequest } from './functions/_lib/handlers'

/** In-memory /api for local `vite` so register/login works without wrangler. */
export function localDrawApi(): Plugin {
  const env = createMemoryEnv()

  return {
    name: 'local-draw-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? ''
        if (!rawUrl.startsWith('/api/')) {
          next()
          return
        }

        const url = new URL(rawUrl, 'http://localhost')
        const path = url.pathname.replace(/^\/api\//, '')
        const chunks: Buffer[] = []

        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', () => {
          void (async () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf8')
              const method = (req.method ?? 'GET').toUpperCase()
              const headers = new Headers()
              for (const [key, value] of Object.entries(req.headers)) {
                if (typeof value === 'string') headers.set(key, value)
                else if (Array.isArray(value)) headers.set(key, value.join(', '))
              }

              const init: RequestInit = { method, headers }
              if (method !== 'GET' && method !== 'HEAD' && raw) {
                init.body = raw
              }

              const request = new Request(url, init)
              const response = await handleApiRequest(request, path, env)

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
