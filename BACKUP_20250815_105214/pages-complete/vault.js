import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Vault() {
  const [data, setData] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    // Simple auth check
    const adminKey = prompt('Enter admin key:');
    if (adminKey !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
      router.push('/');
      return;
    }
    
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const loadData = async () => {
    const res = await fetch('/api/analytics/vault', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_key')}`
      }
    });
    const vault = await res.json();
    setData(vault);
  };
  
  if (!data) return <div>Loading...</div>;
  
  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <h1 className="text-4xl mb-8">🔐 REVENUE COMMAND CENTER</h1>
      
      {/* Today's Revenue */}
      <div className="text-6xl font-bold mb-4">
        ${data.revenue?.today || 0}
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border border-green-500 p-4">
          <div>Active Users</div>
          <div className="text-2xl">{data.users?.active_today || 0}</div>
        </div>
        <div className="border border-green-500 p-4">
          <div>Live Streams</div>
          <div className="text-2xl">{data.streams?.live_now || 0}</div>
        </div>
        <div className="border border-green-500 p-4">
          <div>$/User</div>
          <div className="text-2xl">${data.revenue?.per_user || 0}</div>
        </div>
        <div className="border border-green-500 p-4">
          <div>Projection</div>
          <div className="text-2xl">${data.revenue?.projection || 0}/mo</div>
        </div>
      </div>
    </div>
  );
}