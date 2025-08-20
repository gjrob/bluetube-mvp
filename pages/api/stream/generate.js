import { supabaseAdmin, getSupabaseServerClient } from '../../../lib/supabase';

const STRICT = process.env.STRICT_STREAM_PROVIDERS === 'true'; // if true, no manual fallback

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, platform = 'livepeer' } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const ts  = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const baseKey = `live_${userId.slice(0, 12)}_${ts}_${rnd}`;

    const missing = (msg) => res.status(400).json({ error: msg });

    let out;
    if (platform === 'livepeer') {
      if (!process.env.LIVEPEER_API_KEY) {
        if (STRICT) return missing('LIVEPEER_API_KEY not set');
        out = manual(baseKey, 'livepeer-manual');
      } else {
        out = await createLivepeer(baseKey);
      }
    } else if (platform === 'mux') {
      if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
        if (STRICT) return missing('MUX_TOKEN_ID/SECRET not set');
        out = manual(baseKey, 'mux-manual');
      } else {
        out = await createMux(baseKey);
      }
    } else if (platform === 'cloudflare') {
      if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
        if (STRICT) return missing('Cloudflare credentials not set');
        out = manual(baseKey, 'cloudflare-manual');
      } else {
        out = await createCloudflare(baseKey);
      }
    } else {
      if (STRICT) return missing('Unknown platform');
      out = manual(baseKey, 'manual');
    }

    // persist
    const db = supabaseAdmin || getSupabaseServerClient();
    if (db) {
      await db.from('stream_keys').upsert({
        user_id: userId,
        platform: out.platform,
        stream_id: out.streamId || null,
        stream_key: out.streamKey,
        rtmp_url: out.rtmpUrl,
        playback_url: out.playbackUrl,
        status: out.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    return res.status(201).json({
      success: true,
      ...out,
      instructions: {
        obs:   { server: out.rtmpUrl, streamKey: out.streamKey },
        dji:   { rtmpUrl: `${out.rtmpUrl}/${out.streamKey}` },
      },
    });
  } catch (e) {
    console.error('generate error:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
}

/* helpers */
function manual(key, platform) {
  return {
    streamKey: key,
    rtmpUrl: 'rtmp://live.bluetubetv.live/live',
    playbackUrl: `https://live.bluetubetv.live/hls/${key}.m3u8`,
    platform,
    status: 'ready',
  };
}

async function createLivepeer(baseKey) {
  const r = await fetch('https://livepeer.studio/api/stream', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `BlueTubeTV_${baseKey}`,
      profiles: [
        { name: '720p',  bitrate: 2_000_000, fps: 30, width: 1280, height: 720 },
        { name: '480p',  bitrate: 1_000_000, fps: 30, width: 854,  height: 480 },
        { name: '360p',  bitrate:   500_000, fps: 30, width: 640,  height: 360 },
      ],
    }),
  });
  if (!r.ok) throw new Error(`Livepeer ${r.status}`);
  const s = await r.json();
  return {
    streamKey: s.streamKey,
    rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
    playbackUrl: s.playbackId ? `https://livepeercdn.studio/hls/${s.playbackId}/index.m3u8` : null,
    platform: 'livepeer',
    status: 'ready',
    streamId: s.id,
  };
}

async function createMux(baseKey) {
  const auth = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64');
  const r = await fetch('https://api.mux.com/video/v1/live-streams', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ playback_policy: ['public'], new_asset_settings: { playback_policy: ['public'] } }),
  });
  if (!r.ok) throw new Error(`Mux ${r.status}`);
  const { data } = await r.json();
  return {
    streamKey: data.stream_key,
    rtmpUrl: 'rtmp://global-live.mux.com:5222/live',
    playbackUrl: data.playback_ids?.[0] ? `https://stream.mux.com/${data.playback_ids[0].id}.m3u8` : null,
    platform: 'mux',
    status: 'ready',
    streamId: data.id,
  };
}

async function createCloudflare(baseKey) {
  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta: { name: `BlueTubeTV_${baseKey}` }, recording: { mode: 'automatic' } }),
    }
  );
  if (!r.ok) throw new Error(`Cloudflare ${r.status}`);
  const { result } = await r.json();
  return {
    streamKey: result?.rtmps?.streamKey,
    rtmpUrl: result?.rtmps?.url?.replace('rtmps://', 'rtmp://').replace(':443', ':1935') || 'rtmp://live.cloudflarestream.com/live',
    playbackUrl: result?.uid
      ? `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${result.uid}/manifest/video.m3u8`
      : null,
    platform: 'cloudflare',
    status: 'ready',
    streamId: result?.uid,
  };
}
