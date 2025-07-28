// components/Navigation.js
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="nav-container">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          textDecoration: 'none',
          color: 'white'
        }}>
          <span style={{ fontSize: '28px' }}>🚁</span>
          <span className="gradient-title" style={{ fontSize: '24px', margin: 0 }}>
            BlueTubeTV
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/browse" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Browse
          </Link>
          <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link href="/live" className="hero-button" style={{ padding: '10px 24px', fontSize: '16px' }}>
            Go Live
          </Link>
        </div>
      </div>
    </nav>
  )
}

