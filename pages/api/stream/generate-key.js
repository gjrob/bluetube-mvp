// WORKING Stream Key Generator (Livepeer | Mux | Cloudflare | Manual)
import { supabaseAdmin, getSupabaseServerClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, platform = 'livepeer' } = req.body || {};
    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const baseKey = `live_${(userId || 'demo').slice(0, 8)}_${ts}_${rnd}`;

    let streamData;
    if (platform === 'livepeer')   streamData = await createLivepeerStream(baseKey);
    else if (platform === 'mux')   streamData = await createMuxStream(baseKey);
    else if (platform === 'cloudflare') streamData = await createCloudflareStream(baseKey);
    else streamData = manualStream(baseKey, 'manual');

    // save (prefer admin, fall back to server client)
    const db = supabaseAdmin || getSupabaseServerClient();
    if (db && userId) {
      await db.from('stream_keys').upsert({
        user_id: userId,
        stream_key: streamData.streamKey,
        rtmp_url: streamData.rtmpUrl,
        playback_url: streamData.playbackUrl,
        platform: streamData.platform,
        status: streamData.status,
        stream_id: streamData.streamId || null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    return res.status(200).json({
      success: true,
      ...streamData,
      instructions: {
        obs: { server: streamData.rtmpUrl, streamKey: streamData.streamKey },
        dji: { rtmpUrl: `${streamData.rtmpUrl}/${streamData.streamKey}` },
      },
    });
  } catch (err) {
    console.error('generate-key error:', err);
    const fallback = manualStream(`fallback_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, 'fallback');
    return res.status(200).json({ success: true, note: 'fallback mode', ...fallback });
  }
}

/* Providers */

function manualStream(key, platform) {
  return {
    streamKey: key,
    rtmpUrl: 'rtmp://live.bluetubetv.live/live',
    playbackUrl: `https://live.bluetubetv.live/hls/${key}.m3u8`,
    platform,
    status: 'ready',
  };
}

async function createLivepeerStream(baseKey) {
  if (!process.env.LIVEPEER_API_KEY) return manualStream(baseKey, 'livepeer-manual');

  try {
    const r = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `BlueTubeTV_${baseKey}`,
        profiles: [
          { name: '720p', bitrate: 2_000_000, fps: 30, width: 1280, height: 720 },
          { name: '480p', bitrate: 1_000_000, fps: 30, width: 854,  height: 480 },
          { name: '360p', bitrate:   500_000, fps: 30, width: 640,  height: 360 },
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
  } catch (e) {
    console.warn('Livepeer failed, manual fallback:', e.message);
    return manualStream(baseKey, 'livepeer-manual');
  }
}

async function createMuxStream(baseKey) {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) return manualStream(baseKey, 'mux-manual');

  try {
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
  } catch (e) {
    console.warn('Mux failed, manual fallback:', e.message);
    return manualStream(baseKey, 'mux-manual');
  }
}

async function createCloudflareStream(baseKey) {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    return manualStream(baseKey, 'cloudflare-manual');
  }

  try {
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
      playbackUrl: result?.uid ? `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${result.uid}/manifest/video.m3u8` : null,
      platform: 'cloudflare',
      status: 'ready',
      streamId: result?.uid,
    };
  } catch (e) {
    console.warn('Cloudflare failed, manual fallback:', e.message);
    return manualStream(baseKey, 'cloudflare-manual');
  }
}
