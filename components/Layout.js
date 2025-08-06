// components/Layout.js - Inline Styles Version
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/pilot-setup', label: 'Setup Guide', icon: '📖' },
    { href: '/live', label: 'Dashboard' }
  ];

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '18px',
    fontWeight: '500',
    color: isActive ? '#60a5fa' : '#cbd5e1',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  });

  const linkHoverStyle = {
    color: 'white'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <nav style={{
        background: '#1e293b',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px'
          }}>
          <Link 
  href="/"
  style={{    
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  }}
>
              <span style={{ fontSize: '32px' }}>🚁</span>
              <span style={{
                fontSize: '20px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  BlueTubeTV
                </span>
            
            </Link>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
             {navItems.map(item => (
  <Link 
    key={item.href} 
    href={item.href}
    style={linkStyle(router.pathname === item.href)}
    onMouseEnter={(e) => {
      if (router.pathname !== item.href) {
        e.target.style.color = linkHoverStyle.color;
      }
    }}
    onMouseLeave={(e) => {
      if (router.pathname !== item.href) {
        e.target.style.color = linkStyle(false).color;
      }
    }}
  >
    {item.icon && <span>{item.icon}</span>}
    {item.label}
  </Link>
))}
    <Link 
  href="/live"
  style={{
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
  }}
  
  onMouseEnter={(e) => {
    e.target.style.background = 'linear-gradient(135deg, #b91c1c, #991b1b)';
    e.target.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
    e.target.style.transform = 'translateY(0)';
  }}
>
  Go Live
</Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;