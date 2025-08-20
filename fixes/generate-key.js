// pages/api/stream/generate-key.js
// Generate stream keys using Livepeer

import { Livepeer } from 'livepeer';

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId } = req.body

  try {
    // Create Livepeer stream
    const stream = await livepeer.stream.create({
      name: `BlueTube-${userId}-${Date.now()}`,
      profiles: [
        {
          name: "1080p",
          bitrate: 3000000,
          fps: 30,
          width: 1920,
          height: 1080
        },
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480
        }
      ]
    });

    // Save to database
    const { error } = await supabase
      .from('stream_keys')
      .upsert({
        user_id: userId,
        stream_key: stream.streamKey,
        playback_id: stream.playbackId,
        stream_id: stream.id,
        rtmp_url: 'rtmp://rtmp.livepeer.com/live',
        created_at: new Date().toISOString()
      })

    if (error) throw error

    return res.status(200).json({
      streamKey: stream.streamKey,
      playbackId: stream.playbackId,
      rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
      fullUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
      playerUrl: `https://lvpr.tv/?v=${stream.playbackId}`,
      instructions: {
        obs: {
          server: 'rtmp://rtmp.livepeer.com/live',
          streamKey: stream.streamKey
        },
        drone: {
          rtmpUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`
        }
      }
    })
  } catch (error) {
    console.error('Stream key generation error:', error)
    return res.status(500).json({ error: error.message })
  }
}