import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import dynamic from 'next/dynamic'
import ReactPlayer from 'react-player'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function LiveStreamPage() {
  const router = useRouter()
  const { id } = router.query
  const [stream, setStream] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchStream = async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('id', id)
        .single()
      if (!error) setStream(data)
    }
    fetchStream()
  }, [id])

  if (!stream) return <p style={{ color: 'white' }}>Loading stream…</p>

  return (
    <div style={{ padding: '2rem', background:'#0a1628', minHeight:'100vh', color:'white' }}>
      <h1 style={{ marginBottom: '1rem', color:'#60a5fa' }}>
        🎥 {stream.title || 'Live Stream'}
      </h1>
      <p style={{ marginBottom: '1rem', color:'#94a3b8' }}>
        Hosted by {stream.pilot_name || 'Unknown Pilot'}
      </p>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <ReactPlayer
          url={`https://live.bluetubetv.live/hls/${id}.m3u8`}
          playing
          controls
          width="100%"
          height="500px"
        />
      </div>
    </div>
  )
}
