// pages/success.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Success() {
  const router = useRouter();
  const { type, amount, item } = router.query;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          router.push('/live');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          🎉 Payment Successful!
        </h1>
        
        {type === 'superchat' && (
          <p style={{ fontSize: '1.5rem' }}>
            Thank you for your ${amount} SuperChat!
          </p>
        )}
        
        {type === 'subscription' && (
          <p style={{ fontSize: '1.5rem' }}>
            Welcome to BlueTubeTV Premium!
          </p>
        )}
        
        {type === 'marketplace' && (
          <p style={{ fontSize: '1.5rem' }}>
            Your purchase is ready for download!
          </p>
        )}
        
        <p style={{ marginTop: '30px', fontSize: '1.2rem' }}>
          Redirecting to stream in {countdown} seconds...
        </p>
        
        <button
          onClick={() => router.push('/live')}
          style={{
            marginTop: '20px',
            padding: '15px 30px',
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
            color: 'black',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Return to Stream Now
        </button>
      </div>
    </div>
  );
}
