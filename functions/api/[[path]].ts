/// <reference types="@cloudflare/workers-types" />

import { handleApiRequest } from '../_lib/handlers'
import type { Env } from '../_lib/store'

function routePath(params: { path?: string | string[] }): string {
  const raw = params.path
  if (Array.isArray(raw)) return raw.join('/')
  return raw ?? ''
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const path = routePath(context.params as { path?: string | string[] })
  return handleApiRequest(context.request, path, context.env)
}
