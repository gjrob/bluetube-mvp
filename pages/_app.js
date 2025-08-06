// pages/_app.js - WORKING VERSION
import { useEffect } from 'react'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Fix hydration issues
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp