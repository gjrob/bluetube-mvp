// components/StreamInstructions.js
import { useState, useEffect } from 'react'

export default function StreamInstructions({ streamKey, rtmpUrl }) {
  const [copied, setCopied] = useState(false)
  const [selectedSoftware, setSelectedSoftware] = useState('obs')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const instructions = {
    obs: {
      name: 'OBS Studio',
      steps: [
        'Open OBS Studio',
        'Go to Settings > Stream',
        'Select "Custom" as Service',
        `Set Server to: ${rtmpUrl}`,
        `Set Stream Key to: ${streamKey}`,
        'Click OK and Start Streaming'
      ]
    },
    streamlabs: {
      name: 'Streamlabs OBS',
      steps: [
        'Open Streamlabs OBS',
        'Go to Settings > Stream',
        'Select "Custom RTMP" as Service',
        `Set URL to: ${rtmpUrl}`,
        `Set Stream Key to: ${streamKey}`,
        'Save and Go Live'
      ]
    },
    ffmpeg: {
      name: 'FFmpeg (Advanced)',
      steps: [
        'Open Terminal/Command Prompt',
        'Run the following command:',
        `ffmpeg -re -i input.mp4 -c:v libx264 -preset fast -c:a aac -f flv ${rtmpUrl}/${streamKey}`
      ]
    }
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.95)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        Stream Setup Instructions
      </h2>

      {/* Software Selection */}
      <div style={{ marginBottom: '20px' }}>
        {Object.keys(instructions).map(software => (
          <button
            key={software}
            onClick={() => setSelectedSoftware(software)}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              background: selectedSoftware === software ? '#3b82f6' : 'transparent',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {instructions[software].name}
          </button>
        ))}
      </div>

      {/* Stream Details */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px' }}>RTMP Server:</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '5px'
          }}>
            <input
              type="text"
              value={rtmpUrl}
              readOnly
              style={{
                flex: 1,
                padding: '8px',
                background: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={() => copyToClipboard(rtmpUrl)}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <label style={{ color: '#94a3b8', fontSize: '14px' }}>Stream Key:</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '5px'
          }}>
            <input
              type="password"
              value={streamKey}
              readOnly
              style={{
                flex: 1,
                padding: '8px',
                background: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={() => copyToClipboard(streamKey)}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          Setup {instructions[selectedSoftware].name}
        </h3>
        <ol style={{ color: '#94a3b8', paddingLeft: '20px' }}>
          {instructions[selectedSoftware].steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Test Stream Button */}
      <button
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Test Stream Connection
      </button>
    </div>
  )
}