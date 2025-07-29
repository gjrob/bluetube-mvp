// pages/test-stream.js
import { useState, useRef } from 'react';

export default function TestStream() {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      videoRef.current.srcObject = stream;
      setIsStreaming(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Browser Streaming</h1>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        style={{ width: '100%', maxWidth: '600px' }}
      />
      <br />
      <button 
        onClick={startStream}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          marginTop: '20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Start Camera Stream
      </button>
    </div>
  );
}