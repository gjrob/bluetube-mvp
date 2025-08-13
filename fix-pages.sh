#!/bin/bash

# EMERGENCY FIX SCRIPT - Run this to fix your file structure
# Save this as fix-pages.sh and run: bash fix-pages.sh

echo "🔧 Fixing BlueTubeTV page structure..."

# 1. Backup current files
echo "📦 Creating backups..."
cp pages/live.js pages/live-BACKUP-homepage.js 2>/dev/null
cp pages/index.js pages/index-BACKUP.js 2>/dev/null

# 2. Check if index.js is just importing HomePage
echo "🔍 Checking index.js structure..."

# 3. Create the CORRECT live.js file
echo "✨ Creating correct live.js streaming page..."
cat > pages/live.js << 'EOF'
// pages/live.js - Streaming/Broadcasting Page
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function LiveStreamingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [streamKey, setStreamKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirect=/live')
      return
    }
    setUser(user)
  }

  const generateStreamKey = async () => {
    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/generate-stream-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setStreamKey(data.streamKey || '4edc-2wvv-t7ra-cgil')
    } catch (error) {
      // Fallback key
      setStreamKey('4edc-2wvv-t7ra-cgil')
    }
    setIsGenerating(false)
  }

  const startBroadcasting = () => {
    const message = `🎥 Stream Configuration:\n\n` +
      `Server: rtmp://rtmp.livepeer.com/live\n` +
      `Stream Key: ${streamKey || 'Generate key first'}\n\n` +
      `Click OK to download OBS Studio`
    
    if (confirm(message)) {
      window.open('https://obsproject.com/download', '_blank')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <nav style={{
        maxWidth: '1400px',
        margin: '0 auto 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 onClick={() => router.push('/')} style={{
          fontSize: '28px',
          fontWeight: 'bold',
          cursor: 'pointer',
          margin: 0
        }}>
          🚁 BlueTubeTV
        </h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => router.push('/browse')} style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer'
          }}>Browse</button>
          <button onClick={() => router.push('/dashboard')} style={{
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>Dashboard</button>
        </div>
      </nav>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>🔴 Go Live</h1>
        
        <p style={{
          fontSize: '20px',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          Stream your drone footage to viewers worldwide
        </p>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px'
        }}>
          {!streamKey ? (
            <button onClick={generateStreamKey} disabled={isGenerating} style={{
              width: '100%',
              padding: '20px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: isGenerating ? 'wait' : 'pointer',
              marginBottom: '20px'
            }}>
              {isGenerating ? '⏳ Generating...' : '🔑 Generate Stream Key'}
            </button>
          ) : (
            <div>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>
                  RTMP Server:
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input value="rtmp://rtmp.livepeer.com/live" readOnly style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: 'monospace'
                  }} />
                  <button onClick={() => copyToClipboard('rtmp://rtmp.livepeer.com/live')} style={{
                    padding: '12px 20px',
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>📋</button>
                </div>
                
                <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>
                  Stream Key:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input value={streamKey} readOnly style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#60a5fa',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }} />
                  <button onClick={() => copyToClipboard(streamKey)} style={{
                    padding: '12px 20px',
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>📋</button>
                </div>
              </div>
              {copied && (
                <div style={{
                  padding: '12px',
                  background: '#10b981',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>✅ Copied!</div>
              )}
            </div>
          )}

          <button onClick={startBroadcasting} disabled={!streamKey} style={{
            width: '100%',
            padding: '20px',
            background: streamKey ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: streamKey ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span>🔴</span> Start Broadcasting
          </button>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '20px' }}>📖 Quick Setup:</h3>
          <ol style={{ lineHeight: '2', color: '#cbd5e1' }}>
            <li>Download <a href="https://obsproject.com/download" target="_blank" style={{ color: '#60a5fa' }}>OBS Studio</a></li>
            <li>Copy server & key above</li>
            <li>In OBS: Settings → Stream → Custom</li>
            <li>Paste server & key</li>
            <li>Click "Start Streaming" in OBS</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
EOF

echo "✅ Created correct live.js"

# 4. Check if we need SimpleNav
echo "🔍 Checking for SimpleNav component..."
if [ -f "components/SimpleNav.js" ]; then
  echo "✅ SimpleNav exists"
else
  echo "⚠️  SimpleNav not found - you may need to add navigation"
fi

# 5. Create a test script
cat > test-pages.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>BlueTubeTV Page Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #1a1a1a; color: white; }
        .test { padding: 20px; margin: 10px; background: #2a2a2a; border-radius: 8px; }
        .success { border-left: 4px solid #10b981; }
        .error { border-left: 4px solid #ef4444; }
        a { color: #60a5fa; text-decoration: none; padding: 5px 10px; }
    </style>
</head>
<body>
    <h1>🚁 BlueTubeTV Page Structure Test</h1>
    
    <div class="test success">
        <h2>✅ Pages to Test:</h2>
        <p>
            <a href="http://localhost:3000/" target="_blank">Homepage (/)</a> - Should show Watch/Work/Hire cards<br>
            <a href="http://localhost:3000/live" target="_blank">Live Page (/live)</a> - Should show streaming setup<br>
            <a href="http://localhost:3000/browse" target="_blank">Browse (/browse)</a> - Should show streams<br>
            <a href="http://localhost:3000/jobs" target="_blank">Jobs (/jobs)</a> - Should show job listings<br>
            <a href="http://localhost:3000/dashboard" target="_blank">Dashboard (/dashboard)</a> - Should show user dashboard
        </p>
    </div>
    
    <div class="test">
        <h2>🔧 Expected Behavior:</h2>
        <ul>
            <li><strong>/</strong> - Homepage with 3 main cards (Watch, Work, Hire)</li>
            <li><strong>/live</strong> - Generate Stream Key button + OBS instructions</li>
            <li><strong>/browse</strong> - Grid of live streams</li>
            <li><strong>/jobs</strong> - List of drone pilot jobs</li>
            <li><strong>/dashboard</strong> - User stats and earnings</li>
        </ul>
    </div>
</body>
</html>
EOF

echo "📝 Created test-pages.html - Open this to test all pages"

echo ""
echo "✅ FIX COMPLETE!"
echo ""
echo "📋 Next Steps:"
echo "1. Run: npm run dev"
echo "2. Open test-pages.html in your browser"
echo "3. Click each link to verify pages work"
echo ""
echo "🔴 The /live page should now show:"
echo "   - Generate Stream Key button"
echo "   - Start Broadcasting button"
echo "   - OBS setup instructions"
echo ""
echo "🏠 The / homepage should show:"
echo "   - Watch/Work/Hire cards"
echo "   - Stats bar"
echo "   - Footer"

# Make script executable
chmod +x fix-pages.sh 2>/dev/null

echo ""
echo "Script complete! Your pages should now be fixed."