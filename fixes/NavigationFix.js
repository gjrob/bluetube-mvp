// components/NavigationFix.js
// This fixes all broken navigation buttons

export const navigationFixes = {
  // Fix homepage buttons
  homepage: {
    'Start Streaming FREE': '/signup?role=pilot',
    'Start Watching': '/browse',
    'Start Registration Now': '/signup?role=pilot',
    'Upgrade Storage Plan': '/pricing#storage'
  },

  // Fix live page buttons
  livePage: {
    'Start Broadcasting': async () => {
      // Get stream key first
      const response = await fetch('/api/stream/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: getCurrentUserId() })
      })
      
      const { streamKey, rtmpUrl } = await response.json()
      
      // Show instructions modal
      showStreamInstructions(streamKey, rtmpUrl)
      
      // Start local preview
      startLocalPreview()
    },
    'Send SuperChat': async (amount, message) => {
      const response = await fetch('/api/super-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, message, streamId: getCurrentStreamId() })
      })
      
      return response.json()
    }
  },

  // Fix dashboard buttons
  dashboard: {
    'Go Live': '/live',
    'View Earnings': '/dashboard#earnings',
    'Post Job': '/jobs/post',
    'Browse Streams': '/browse'
  },

  // Fix marketplace
  marketplace: {
    'Purchase': async (videoId, price) => {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          price,
          type: 'marketplace_purchase'
        })
      })
      
      const { url } = await response.json()
      if (url) window.location.href = url
    }
  }
}

// Helper functions
function getCurrentUserId() {
  // Get from supabase auth or localStorage
  return localStorage.getItem('userId')
}

function getCurrentStreamId() {
  // Get from URL or state
  return new URLSearchParams(window.location.search).get('streamId')
}

function showStreamInstructions(streamKey, rtmpUrl) {
  // Show modal with instructions
  const modal = document.createElement('div')
  modal.innerHTML = `
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999;">
      <div style="background: white; padding: 20px; margin: 50px auto; max-width: 600px;">
        <h2>Your Stream Key</h2>
        <p>RTMP URL: ${rtmpUrl}</p>
        <p>Stream Key: ${streamKey}</p>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
}

async function startLocalPreview() {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
  })
  
  const video = document.querySelector('#localVideo')
  if (video) {
    video.srcObject = stream
  }
}