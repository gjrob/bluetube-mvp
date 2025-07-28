// pages/404.js
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <span style={{ fontSize: '80px' }}>🚁</span>
        </div>
        
        <h1 style={{
          fontSize: '120px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          404
        </h1>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Lost in the Clouds</h2>
        <p style={{ color: '#94a3b8', fontSize: '20px', marginBottom: '40px' }}>
          This page seems to have flown away. Let's get you back on course.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/">
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #66d9ef 100%)',
              color: 'white',
              padding: '16px 48px',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              🏠 Go Home
            </span>
          </Link>

          <Link href="/browse">
            <span style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '16px 48px',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              📺 Browse Content
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
