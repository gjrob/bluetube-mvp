// pages/services/live-streaming.js - Live Streaming Services Marketplace
import { useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

export default function LiveStreamingServices() {
  const [serviceType, setServiceType] = useState('event')
  
  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
            📺 Live Streaming Services
          </h1>
          <p style={{ fontSize: '24px', marginBottom: '30px' }}>
            Professional aerial live streaming for your events
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button style={{
              padding: '15px 30px',
              backgroundColor: 'white',
              color: '#667EEA',
              borderRadius: '50px',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Book Live Stream
            </button>
            <button style={{
              padding: '15px 30px',
              backgroundColor: 'transparent',
              color: 'white',
              borderRadius: '50px',
              border: '2px solid white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Become a Streamer
            </button>
          </div>
        </div>

        {/* Service Types */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <ServiceCard
            title="Live Event Coverage"
            price="$299/hour"
            features={[
              "Professional drone pilot",
              "4K live streaming",
              "Real-time aerial views",
              "Stream to your platform",
              "Chat moderation included"
            ]}
            popular={true}
          />
          <ServiceCard
            title="Virtual Property Tours"
            price="$199/property"
            features={[
              "Live walkthrough",
              "Aerial establishing shots",
              "Interactive Q&A",
              "Recording included",
              "Multi-platform streaming"
            ]}
          />
          <ServiceCard
            title="Construction Progress"
            price="$999/month"
            features={[
              "Weekly live updates",
              "Time-lapse creation",
              "Stakeholder portal",
              "HD recording archive",
              "Progress reports"
            ]}
          />
          <ServiceCard
            title="Sports & Races"
            price="$499/event"
            features={[
              "Multi-angle coverage",
              "Live commentary option",
              "Highlight reel creation",
              "Social media clips",
              "Instant replay capability"
            ]}
          />
        </div>

        {/* How It Works */}
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '36px', marginBottom: '30px', textAlign: 'center' }}>
            How Live Streaming Jobs Work
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <Step number="1" title="Post Your Event" description="Tell us when, where, and what to stream" />
            <Step number="2" title="Get Matched" description="We assign a certified streaming pilot" />
            <Step number="3" title="Go Live" description="Professional streaming on your schedule" />
            <Step number="4" title="Get Deliverables" description="Receive recordings and highlights" />
            <Step number="5" title="Pay After" description="Only pay when you're satisfied" />
          </div>
        </div>

        {/* Revenue Calculator */}
        <LiveStreamCalculator />
      </div>
    </Layout>
  )
}

// Service Card Component
function ServiceCard({ title, price, features, popular }) {
  return (
    <div style={{
      backgroundColor: '#1E293B',
      borderRadius: '16px',
      padding: '30px',
      position: 'relative',
      border: popular ? '2px solid #10B981' : '1px solid #334155'
    }}>
      {popular && (
        <span style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          MOST POPULAR
        </span>
      )}
      <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '20px' }}>
        {price}
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {features.map((feature, i) => (
          <li key={i} style={{ marginBottom: '10px' }}>
            ✅ {feature}
          </li>
        ))}
      </ul>
      <button style={{
        width: '100%',
        marginTop: '20px',
        padding: '12px',
        backgroundColor: popular ? '#10B981' : '#3B82F6',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Book Now
      </button>
    </div>
  )
}

// Step Component
function Step({ number, title, description }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '60px',
        height: '60px',
        backgroundColor: '#3B82F6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 15px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {number}
      </div>
      <h4 style={{ marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: '#94A3B8', fontSize: '14px' }}>{description}</p>
    </div>
  )
}

// Live Stream Revenue Calculator
function LiveStreamCalculator() {
  const [hours, setHours] = useState(2)
  const [events, setEvents] = useState(4)
  
  const hourlyRate = 299
  const platformFee = 0.15
  const pilotEarnings = hourlyRate * hours * events * (1 - platformFee)
  const platformRevenue = hourlyRate * hours * events * platformFee
  const totalRevenue = hourlyRate * hours * events

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      borderRadius: '20px',
      padding: '40px'
    }}>
      <h2 style={{ fontSize: '36px', marginBottom: '30px' }}>
        💰 Revenue Calculator
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Hours per Event
          </label>
          <input
            type="range"
            min="1"
            max="8"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{hours} hours</p>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Events per Month
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={events}
            onChange={(e) => setEvents(e.target.value)}
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{events} events</p>
        </div>
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
          <div>
            <p style={{ color: '#E0E7FF', marginBottom: '5px' }}>Pilot Earnings</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
              ${pilotEarnings.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ color: '#E0E7FF', marginBottom: '5px' }}>Platform Revenue</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>
              ${platformRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ color: '#E0E7FF', marginBottom: '5px' }}>Total Revenue</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FCD34D' }}>
              ${totalRevenue.toLocaleString()}/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}