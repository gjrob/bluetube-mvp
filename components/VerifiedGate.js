import React from 'react';
import { supabase } from '@lib/supabaseClient';

export default function VerifiedGate({ children }) {
  const [ok, setOk] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const verified = !!user?.email_confirmed_at;
      setOk(verified);
    })();
  }, []);

  if (ok === null) {
    return <div style={{ color:'#94a3b8', padding:16 }}>Checking verification…</div>;
  }

  if (!ok) {
    return (
      <div style={{ padding: 16, border:'1px solid #f59e0b', borderRadius:8, background:'rgba(245, 158, 11, .08)', color:'#fbbf24' }}>
        <b>Verify your email to continue.</b><br />
        We’ve sent you a confirmation link. Didn’t get it?
        <button
          style={{ marginLeft: 8, padding:'6px 10px', borderRadius:6, border:'1px solid #fbbf24', background:'transparent', color:'#fbbf24', cursor:'pointer' }}
          onClick={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) return alert('No email on file.');
            await supabase.auth.resend({
              type: 'signup',
              email: user.email,
              options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
            });
            alert('Confirmation email re-sent.');
          }}
        >Resend</button>
      </div>
    );
  }

  return children;
}
