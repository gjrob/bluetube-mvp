// pages/_app.js - WORKING VERSION
import { useEffect } from 'react'
import { AuthProvider } from '../hooks/useAuth'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  )
}
export default MyApp