// pages/_app.js - WORKING VERSION
import { useEffect } from 'react'
import { AuthProvider } from '../hooks/useAuth'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp