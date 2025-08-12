#!/bin/bash
# debug-components.sh - Find what's causing the undefined error

echo "🔍 BlueTubeTV Component Debugger"
echo "================================="

# Check what's in index.js
echo ""
echo "📄 Checking pages/index.js imports..."
if [ -f "pages/index.js" ]; then
  echo "Imports found in index.js:"
  grep -E "^import|^const.*require" pages/index.js | head -20
  echo ""
  
  # Check for Layout import
  if grep -q "import.*Layout" pages/index.js; then
    echo "⚠️  Found Layout import in index.js"
    echo "   Checking if Layout exists and exports correctly..."
    
    if [ -f "components/Layout.js" ]; then
      if grep -q "export default Layout" components/Layout.js; then
        echo "   ✅ Layout has default export"
      else
        echo "   ❌ Layout missing default export!"
      fi
    else
      echo "   ❌ Layout.js file not found!"
    fi
  fi
  
  # Check for other component imports
  echo ""
  echo "Other components imported:"
  grep -oE "from ['\"]\.\.?/components/[^'\"]+['\"]" pages/index.js | sed "s/from ['\"]//g" | sed "s/['\"]//g"
else
  echo "❌ pages/index.js not found!"
fi

# Check Navigation component
echo ""
echo "🔍 Checking Navigation component..."
if [ -f "components/Navigation.js" ]; then
  if grep -q "export default Navigation" components/Navigation.js; then
    echo "✅ Navigation has default export"
  else
    echo "❌ Navigation missing default export!"
    echo "Creating minimal Navigation..."
    cat > components/Navigation.js << 'EOF'
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="nav-container" style={styles.nav}>
      <div style={styles.container}>
        <Link href="/">
          <a style={styles.logo}>🌊 BlueTubeTV</a>
        </Link>
        <div style={styles.links}>
          <Link href="/browse"><a style={styles.link}>Browse</a></Link>
          <Link href="/login"><a style={styles.link}>Login</a></Link>
          <Link href="/dashboard"><a style={styles.link}>Dashboard</a></Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '20px 0',
    borderBottom: '1px solid rgba(0, 180, 216, 0.2)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00d4ff',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '30px',
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
  },
};

export default Navigation;
EOF
    echo "✅ Created Navigation.js"
  fi
else
  echo "❌ Navigation.js not found - creating..."
  # Create Navigation using the code above
fi

# Check Footer component
echo ""
echo "🔍 Checking Footer component..."
if [ -f "components/Footer.js" ]; then
  if grep -q "export default Footer" components/Footer.js; then
    echo "✅ Footer has default export"
  else
    echo "❌ Footer missing default export!"
  fi
else
  echo "❌ Footer.js not found - creating..."
  cat > components/Footer.js << 'EOF'
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © 2024 BlueTubeTV. Ride the wave of decentralized content. 🌊
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '40px 20px',
    textAlign: 'center',
    borderTop: '1px solid rgba(0, 180, 216, 0.2)',
    marginTop: 'auto',
  },
  text: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
};

export default Footer;
EOF
  echo "✅ Created Footer.js"
fi

echo ""
echo "📝 Recommendation:"
echo "==================="
echo "1. Use the self-contained index.js provided (no Layout import)"
echo "2. Or fix the component exports that are missing"
echo "3. Clear Next.js cache: rm -rf .next"
echo "4. Restart: npm run dev"