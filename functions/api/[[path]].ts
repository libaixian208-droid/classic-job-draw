/// <reference types="@cloudflare/workers-types" />

import { handleApiRequest, type SessionStore } from '../_lib/handlers'
import { loadSession, saveSession, type Env } from '../_lib/store'

function routePath(params: { path?: string | string[] }): string {
  const raw = params.path
  if (Array.isArray(raw)) return raw.join('/')
  return raw ?? ''
}

function createKvStore(kv: KVNamespace): SessionStore {
  return {
    load: () => loadSession(kv),
    save: (session) => saveSession(kv, session),
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const path = routePath(context.params as { path?: string | string[] })
  try {
    return await handleApiRequest(
      context.request,
      path,
      createKvStore(context.env.DRAW_KV),
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ ok: false, error: '伺服器錯誤，請稍後再試' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }
}
