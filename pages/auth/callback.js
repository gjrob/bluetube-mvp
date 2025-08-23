// pages/auth/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const exchangeSession = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      await fetch('/api/selfheal/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ kind:'auth_callback_error', message: error.message, href: window.location.href })
});
      if (error) {
        console.error('Auth callback error:', error.message);
        router.push('/login');
      } else {
        // success → send them to dashboard
        router.push('/dashboard');
      }
    };
    exchangeSession();
  }, [router]);

  return <p style={{ color: 'white', textAlign: 'center' }}>Completing login…</p>;
}
