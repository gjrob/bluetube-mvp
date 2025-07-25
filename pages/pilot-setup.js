import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2, Zap, DollarSign, Users } from 'lucide-react';
import SignupModal from '../components/SignupModal';
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <a href="/" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.2rem'
      }}>
        ← Back to Stream
      </a>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚁 Start Streaming in 2 Minutes
        </h1>

        {/* Quick Start */}
        <div style={{ 
          background: 'rgba(34, 197, 94, 0.2)', 
          border: '2px solid #22c55e',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>⚡ Quick Start for DJI Pilots</h2>
          
          <ol style={{ lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Get your stream key from <a href="https://dash.cloudflare.com" style={{ color: '#3b82f6' }}>Cloudflare Stream</a></li>
            <li>Open DJI Fly app → Settings → Live Streaming → RTMP Custom</li>
            <li>Enter URL: <code style={{ 
              background: '#000', 
              padding: '5px 10px', 
              borderRadius: '5px' 
            }}>rtmp://live.cloudflare.com/live/</code></li>
            <li>Paste your stream key and tap "Start Live"</li>
            <li>You're LIVE! Share your link and get tipped! 💰</li>
          </ol>
        </div>

        {/* Supported Drones */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>✅ Supported Drones</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {['Mavic 3', 'Air 2S', 'Mini 3 Pro', 'DJI FPV', 'Phantom 4', 'Inspire 2'].map(drone => (
              <div key={drone} style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                ✓ {drone}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>📱 Detailed Setup</h2>
          
          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 1: Get Cloudflare Stream Key</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Sign up at <a href="https://dash.cloudflare.com" style={{ color: '#3b82f6' }}>dash.cloudflare.com</a> (free)</li>
            <li>Go to Stream → Live Inputs → Create Live Input</li>
            <li>Copy your Stream Key (keep it private!)</li>
          </ul>

          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 2: Configure DJI App</h3>
          <div style={{ 
            background: '#000', 
            padding: '20px', 
            borderRadius: '10px',
            fontFamily: 'monospace',
            marginTop: '10px'
          }}>
            <div>RTMP URL: rtmp://live.cloudflare.com/live/</div>
            <div>Stream Key: [Your key from step 1]</div>
            <div>Resolution: 720p (recommended)</div>
            <div>Bitrate: 2500-4000 kbps</div>
          </div>

          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 3: Share Your Stream</h3>
          <p>Your viewers can watch and tip at:</p>
          <code style={{ 
            background: '#000', 
            padding: '10px', 
            borderRadius: '5px',
            display: 'block',
            marginTop: '10px'
          }}>
            https://bluetubetv.live/watch/[your-stream-id]
          </code>
        </div>

        {/* Tips */}
        <div style={{ 
          background: 'rgba(251, 191, 36, 0.1)', 
          border: '1px solid #fbbf24',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>💡 Pro Tips</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>📡 Use 5GHz WiFi or 4G/5G for best quality</li>
            <li>🔋 Streaming drains battery ~20% faster</li>
            <li>🌅 Golden hour streams get the most tips</li>
            <li>🎤 Narrate your flight for more engagement</li>
            <li>📍 Add location to your stream title</li>
          </ul>
        </div>

        {/* Earnings */}
        <div style={{ 
          background: 'linear-gradient(to right, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>💰 You Keep 80% of All Tips!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Average pilot makes $50-200 per stream
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px',
            flexWrap: 'wrap' 
          }}>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ fontSize: '2rem', color: '#22c55e' }}>$25</div>
              <div>Average tip</div>
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ fontSize: '2rem', color: '#22c55e' }}>$20</div>
              <div>You keep</div>
              <footer>
               <a href="/terms">Terms of Service</a>
               <a href="/privacy">Privacy Policy</a>
               <a href="/legal">Terms & Privacy</a>
              </footer>
            </div>
          </div>
        </div>

        {/* Include the SignupModal component */}
        <SignupModal />
      </div>
    </div>
  );
