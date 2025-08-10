export default function Custom404() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0e27',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '120px' }}>404</h1>
        <p>Page not found</p>
        <a href="/" style={{ color: '#60a5fa' }}>Go Home</a>
      </div>
    </div>
  )
}
