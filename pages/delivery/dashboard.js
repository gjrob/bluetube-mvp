// pages/delivery/dashboard.js
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([
    { id: 1, client: 'Smith Wedding', status: 'delivered', size: '18.3 GB', revenue: '$45' },
    { id: 2, client: 'Downtown Condo Tour', status: 'processing', size: '6.2 GB', revenue: '$15' },
    { id: 3, client: 'Marathon Event', status: 'uploading', size: '42.1 GB', revenue: '$85' }
  ])

  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#00ff88', fontSize: '48px', marginBottom: '20px' }}>
          📦 Delivery Dashboard
        </h1>
        
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '20px', 
            borderRadius: '15px',
            border: '1px solid rgba(0,255,136,0.3)'
          }}>
            <div style={{ fontSize: '36px', color: '#00ff88', fontWeight: 'bold' }}>
              $145
            </div>
            <div style={{ color: '#888' }}>Today's Revenue</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '20px', 
            borderRadius: '15px',
            border: '1px solid rgba(0,212,255,0.3)'
          }}>
            <div style={{ fontSize: '36px', color: '#00d4ff', fontWeight: 'bold' }}>
              66.6 GB
            </div>
            <div style={{ color: '#888' }}>Total Delivered</div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '20px', 
            borderRadius: '15px',
            border: '1px solid rgba(255,0,110,0.3)'
          }}>
            <div style={{ fontSize: '36px', color: '#ff006e', fontWeight: 'bold' }}>
              12
            </div>
            <div style={{ color: '#888' }}>Active Deliveries</div>
          </div>
        </div>
        
        {/* Recent Deliveries */}
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Recent Deliveries</h2>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '15px', 
          overflow: 'hidden' 
        }}>
          {deliveries.map(delivery => (
            <div key={delivery.id} style={{ 
              padding: '20px', 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                  {delivery.client}
                </div>
                <div style={{ color: '#888', fontSize: '14px' }}>
                  {delivery.size}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  background: delivery.status === 'delivered' ? '#00ff88' : 
                            delivery.status === 'processing' ? '#00d4ff' : '#ffa500',
                  color: '#000'
                }}>
                  {delivery.status}
                </span>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                  {delivery.revenue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}