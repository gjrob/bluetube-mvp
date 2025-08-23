// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const SUPABASE_URL = (typeof Deno !== 'undefined' && Deno.env.get)
  ? Deno.env.get('SUPABASE_URL')!
  : process.env.SUPABASE_URL!
const SERVICE_ROLE_KEY = (typeof Deno !== 'undefined' && Deno.env.get)
  ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  : process.env.SUPABASE_SERVICE_ROLE_KEY!
const WEBHOOK_SECRET = (typeof Deno !== 'undefined' && Deno.env.get)
  ? Deno.env.get('WEBHOOK_SECRET')!
  : process.env.WEBHOOK_SECRET! // shared secret
/// <reference types="deno.ns" />

async function updateLive(stream_key: string, live: boolean) {
  const body: any = live
    ? { is_live: true, started_at: new Date().toISOString(), ended_at: null }
    : { is_live: false, ended_at: new Date().toISOString() }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/streams?stream_key=eq.${encodeURIComponent(stream_key)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`DB update failed (${res.status}): ${txt}`)
  }
}

function verifySecret(req: Request) {
  // Simple shared-secret header
  const hdr = req.headers.get('x-webhook-secret') || ''
  return hdr && hdr === WEBHOOK_SECRET
}

function parseNginx(body: URLSearchParams) {
  // NGINX-RTMP on_publish/on_done example payload:
  // name=<stream_key>&clientid=...&addr=...&call=publish|done
  const stream_key = body.get('name') || ''
  const call = (body.get('call') || '').toLowerCase()
  const live = call === 'publish' || call === 'on_publish'
  return { stream_key, live }
}

async function parseJson(req: Request) {
  // Generic JSON: { provider, event, stream_key, livepeer: {...}, cloudflare: {...} }
  const j = await req.json().catch(() => ({} as any))
  // Livepeer webhook example:
  // event: "stream.started" | "stream.idle", id / streamId in body
  if (j.provider === 'livepeer') {
    const live = j.event === 'stream.started'
    // Assume you stored your stream_key == livepeer stream "streamKey" or "name"
    const stream_key = j.stream?.streamKey || j.stream?.name || j.streamKey || ''
    return { stream_key, live }
  }
  // Cloudflare Stream Live Input example (basic):
  if (j.provider === 'cloudflare') {
    const live = j.event === 'live_input.started'
    const stream_key = j.input?.rtmp?.streamKey || j.input?.uid || ''
    return { stream_key, live }
  }
  // Fallback generic
  return { stream_key: j.stream_key || '', live: !!j.live }
}

export default async function handler(req: Request) {
  try {
    if (!verifySecret(req)) {
      return new Response('Unauthorized', { status: 401 })
    }

    let stream_key = ''
    let live = false

    if (req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
      const bodyText = await req.text()
      const body = new URLSearchParams(bodyText)
      ;({ stream_key, live } = parseNginx(body))
    } else {
      ;({ stream_key, live } = await parseJson(req))
    }

    if (!stream_key) {
      return new Response('Missing stream_key', { status: 400 })
    }

    await updateLive(stream_key, live)

    return new Response(JSON.stringify({ ok: true, stream_key, live }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}
