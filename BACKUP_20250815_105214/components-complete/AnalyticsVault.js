// ANALYTICS DASHBOARD COMPONENT
// components/AnalyticsVault.js
// ============================================

import { useState, useEffect } from 'react';

export default function AnalyticsVault() {
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVault();
    const interval = setInterval(loadVault, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadVault = async () => {
    try {
      const res = await fetch('/api/analytics/vault', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_KEY}`
        }
      });
      const data = await res.json();
      setVault(data);
    } catch (error) {
      console.error('Failed to load vault:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading vault...</div>;
  if (!vault) return <div>No data</div>;

  return (
    <div className="bg-black text-green-400 p-6 font-mono">
      <h1 className="text-3xl mb-6">🔐 ANALYTICS VAULT</h1>
      
      {/* Real-time Revenue Ticker */}
      <div className="bg-green-900/20 border border-green-500 p-4 mb-6 rounded">
        <div className="text-4xl font-bold">
          ${vault.revenue.today.toLocaleString()}
        </div>
        <div className="text-sm opacity-80">
          TODAY • {vault.revenue.growth_percent > 0 ? '↑' : '↓'} {vault.revenue.growth_percent}%
        </div>
        <div className="text-xs mt-2">
          RUN RATE: ${vault.revenue.projection}/mo
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-3 rounded">
          <div className="text-xs opacity-60">USERS</div>
          <div className="text-2xl">{vault.users.active_today}</div>
          <div className="text-xs">{vault.users.retention_rate}% retained</div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded">
          <div className="text-xs opacity-60">STREAMS</div>
          <div className="text-2xl">{vault.streams.live_now}</div>
          <div className="text-xs">{vault.streams.avg_viewers} avg viewers</div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded">
          <div className="text-xs opacity-60">$/USER</div>
          <div className="text-2xl">${vault.revenue.per_user}</div>
          <div className="text-xs">${vault.revenue.hourly_rate}/hour</div>
        </div>
        
        <div className="bg-gray-900 p-3 rounded">
          <div className="text-xs opacity-60">HEALTH</div>
          <div className="text-2xl">{vault.performance.uptime}</div>
          <div className="text-xs">{vault.performance.error_rate}% errors</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-sm font-bold mb-3">REVENUE STREAMS</h3>
        {Object.entries(vault.revenue.by_type).map(([type, amount]) => (
          <div key={type} className="flex justify-between mb-1">
            <span className="text-xs">{type.toUpperCase()}</span>
            <span className="text-xs">${amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* AI Predictions */}
      <div className="bg-blue-900/20 border border-blue-500 p-4 rounded mb-6">
        <h3 className="text-sm font-bold mb-3">🤖 AI PREDICTIONS</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs">Tomorrow</span>
            <span className="text-xs">${vault.predictions.tomorrow_revenue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Next Week</span>
            <span className="text-xs">${vault.predictions.week_revenue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs">Month End</span>
            <span className="text-xs">${vault.predictions.month_end_revenue}</span>
          </div>
          <div className="text-xs mt-2 opacity-60">
            Trend: {vault.predictions.trend_direction} {vault.predictions.trend_percent}%
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {vault.alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold">⚠️ ALERTS</h3>
          {vault.alerts.map((alert, i) => (
            <div key={i} className={`p-2 rounded text-xs ${
              alert.level === 'critical' ? 'bg-red-900/20 border border-red-500' :
              alert.level === 'warning' ? 'bg-yellow-900/20 border border-yellow-500' :
              'bg-blue-900/20 border border-blue-500'
            }`}>
              <div className="font-bold">{alert.message}</div>
              <div className="opacity-60">→ {alert.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
    console.log(`User ${userId} banned for: ${reason}`);
    // Notify user
    await this.notifyUser(userId, `You have been banned for: ${reason}`);