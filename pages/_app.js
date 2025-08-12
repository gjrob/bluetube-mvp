import { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize system if needed
    if (typeof window !== 'undefined') {
      console.log('BlueTubeTV initialized');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0e7490 100%)'
    }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BlueTubeTV - Drone Streaming Platform</title>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
