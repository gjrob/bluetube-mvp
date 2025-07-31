import React, { useState, useRef, useEffect } from 'react';

export default function BrowserStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState('Ready to stream');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Get available cameras
    navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    });
  }, []);

  const startStream = async () => {
    try {
      setStreamStatus('🎥 Accessing camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      setStreamStatus('🔴 LIVE - Broadcasting from browser!');
      
      // Here you would connect to your RTMP server
      // For now, we're just showing the local preview
      
    } catch (error) {
      console.error('Stream error:', error);
      setStreamStatus('❌ Camera access denied');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setStreamStatus('Stream ended');
  };

return (
  <div>
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🚁</span>
            Browser Live Streaming (No OBS!)
          </h2>
          <p className="text-white/80 mt-1">Stream directly from your browser - Mac friendly!</p>
        </div>

        {/* Video Preview */}
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#1f2937',
          overflow: 'hidden'
        }}>
          {!isStreaming ? (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📹</div>
                <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                  Click "Start Streaming" to go live
                </p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}

          {/* Status Badge */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem'
          }}>
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isStreaming ? '#dc2626' : '#374151',
              color: isStreaming ? 'white' : '#d1d5db'
            }}>
              {isStreaming && (
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }}></span>
              )}
              {streamStatus}
            </div>
          </div>
        </div>

        {/* Camera Selection */}
        {devices.length > 1 && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#d1d5db',
              marginBottom: '8px'
            }}>
              Select Camera:
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              disabled={isStreaming}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#1f2937',
                color: 'white',
                borderRadius: '8px',
                border: '1px solid #374151',
                outline: 'none'
              }}
            >
              {devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
    {/* Stream Button */}
    <button
      onClick={isStreaming ? stopStream : startStream}
      style={{
        width: '100%',
        padding: '16px 24px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '18px',
        transition: 'all 0.2s',
        border: 'none',
        cursor: 'pointer',
        background: isStreaming
          ? '#374151'
          : 'linear-gradient(to right, #dc2626, #ec4899)',
        color: 'white',
        boxShadow: isStreaming ? 'none' : '0 10px 25px rgba(0,0,0,0.3)'
      }}
      onMouseOver={(e) => {
        if (isStreaming) {
          e.target.style.background = '#4b5563';
        }
      }}
      onMouseOut={(e) => {
        if (isStreaming) {
          e.target.style.background = '#374151';
        }
      }}
    >
      {isStreaming ? '⏹ Stop Streaming' : '🔴 Start Streaming'}
    </button>

    {/* Instructions */}
    <div style={{
      backgroundColor: 'rgba(30, 58, 138, 0.2)',
      border: '1px solid #1e3a8a',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <h3 style={{
        fontWeight: '600',
        color: '#60a5fa',
        marginBottom: '8px'
      }}>✨ Quick Start:</h3>
      <ol style={{
        fontSize: '14px',
        color: '#d1d5db',
        lineHeight: '1.5'
      }}>
        <li>1. Click "Start Streaming" above</li>
        <li>2. Allow camera/microphone access</li>
        <li>3. You're live! No OBS needed</li>
        <li>4. Your viewers can watch at <code style={{
          backgroundColor: '#1f2937',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>/watch/test123</code></li>
      </ol>
    </div>

    {/* Stream Stats */}
    {isStreaming && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        paddingTop: '16px'
      }}>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Viewers</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>247</p>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Duration</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>5:32</p>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Tips</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>$127</p>
        </div>
      </div>
    )}
  </div>
  );
}