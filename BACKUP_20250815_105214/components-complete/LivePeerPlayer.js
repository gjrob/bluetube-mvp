// components/LivePeerPlayer.js
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import HLS.js to avoid SSR issues
const HlsPlayer = ({ playbackId }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playbackId || !videoRef.current) return;

    const loadVideo = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        const video = videoRef.current;
        const playbackUrl = `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          
          hls.loadSource(playbackUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            video.play().catch(e => console.log('Autoplay prevented:', e));
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError('Stream not available');
              setIsLoading(false);
            }
          });

          return () => {
            hls.destroy();
          };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari
          video.src = playbackUrl;
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false);
            video.play().catch(e => console.log('Autoplay prevented:', e));
          });
        }
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load player');
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [playbackId]);

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>{error}</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            The stream may not have started yet or has ended.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '20px',
          zIndex: 10
        }}>
          Loading stream...
        </div>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          display: isLoading ? 'none' : 'block'
        }}
      />
    </>
  );
};

// Export with dynamic import to avoid SSR issues
export default dynamic(() => Promise.resolve(HlsPlayer), {
  ssr: false
});