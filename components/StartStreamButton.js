// components/StartStreamButton.js
import React from 'react';

// 1) SUPABASE CLIENT — try to use your existing client
// If your client exports `supabase` as a named export:
import { supabase } from '@lib/supabaseClient';

// If the above import errors, use this fallback client instead:
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// 2) ROUTE HELPER — use it if you created lib/urls.js earlier
let route = (p) => (p.startsWith('http') ? p : p.startsWith('/') ? p : `/${p}`);
try {
  // If you have @lib/urls with route(), prefer that:
  // eslint-disable-next-line global-require
  route = require('@lib/urls').route || route;
} catch (_) { /* no-op */ }

export default function StartStreamButton({
  title = 'My Live Flight',
  description = 'Streaming from the field',
  onCreated, // optional callback with the created row
}) {
  const [loading, setLoading] = React.useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // 1) get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert('Please sign in first.');
        setLoading(false);
        return;
      }

      // 2) insert a streaming session row with the OWNER set
      //    (matches the RLS policy pilot_user_id::uuid = auth.uid())
      const { data, error: insertError } = await supabase
        .from('streaming_sessions')
        .insert({
          pilot_user_id: user.id,           // <- IMPORTANT
          session_title: title,
          session_description: description,
          is_session_live: false,
          viewer_count: 0,
          tips_received: 0
        })
        .select()
        .single();

      if (insertError) {
        alert('Could not create session: ' + insertError.message);
        setLoading(false);
        return;
      }

      // 3) optional callback
      if (onCreated) onCreated(data);

      // 4) send them to your live/control page
      window.location.href = route('/live'); // or route(`/live/${data.id}`)
    } catch (e) {
      alert('Unexpected error: ' + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      style={{
        padding: '12px 24px',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
        color: '#fff',
        fontWeight: 700,
        cursor: loading ? 'default' : 'pointer'
      }}
    >
      {loading ? 'Starting…' : 'Start Stream'}
    </button>
  );
}
