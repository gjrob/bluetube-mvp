// ui/Layout.js
import { colors } from '../styles/styles'

export default function Layout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.background,
        color: colors.text,
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
      }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>
          BlueTubeTV
        </h1>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto' }}>
        {children}
      </main>

      <footer style={{ marginTop: '40px', fontSize: '14px', color: colors.muted }}>
        © {new Date().getFullYear()} BlueTubeTV
      </footer>
    </div>
  )
}
