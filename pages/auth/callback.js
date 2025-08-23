import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    handleCallback();
  }, [router]);

  const handleCallback = async () => {
    try {
      // Get the hash from the URL (Supabase returns tokens in hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        // Already authenticated via hash
        router.push('/dashboard');
        return;
      }

      // If no hash, check for code in query params
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        
        // Try to exchange code if present
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            router.push('/login?error=auth_failed');
            return;
          }
        } else {
          router.push('/login?error=no_code');
          return;
        }
      }

      // Check if we have a session now
      const { data: { session: newSession } } = await supabase.auth.getSession();
      
      if (newSession) {
        // Success! Redirect to dashboard
        router.push('/dashboard');
      } else {
        // No session, redirect to login
        router.push('/login?error=no_session');
      }
      
    } catch (error) {
      console.error('Callback error:', error);
      
      // Log error if needed
      try {
        await fetch('/api/selfheal/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            kind: 'auth_callback_error', 
            message: error.message, 
            href: window.location.href 
          })
        });
      } catch (logError) {
        console.error('Logging failed:', logError);
      }
      
      router.push('/login?error=callback_failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
        <div className="spinner" />
        <style jsx>{`
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}