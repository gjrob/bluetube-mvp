// pages/live.js - ENHANCED VERSION WITH ALL REVENUE STREAMS
import QuickSetupCard from '../components/QuickSetupCard';
import LiveChat from '../components/LiveChat'; 
import Layout from '../components/Layout';
import SuperChat from '../components/SuperChat';
import BrowserStream from '../components/BrowserStream';
import NFTMinting from '../components/NFTMinting';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import dynamic from 'next/dynamic';

const FlightCompliance = dynamic(() => import('../components/FlightCompliance'), { ssr: false });

export default function Live() {
  const [streamKey, setStreamKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFlightCompliance, setShowFlightCompliance] = useState(false);
  const [showNFTMinting, setShowNFTMinting] = useState(false);
  const [activeTab, setActiveTab] = useState('stream'); // stream, services, storage
  const [user, setUser] = useState(null);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    pending: 0
  });
  const [showStreamKeyModal, setShowStreamKeyModal] = useState(false);
  const [generatedStreamKey, setGeneratedStreamKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const router = useRouter();

useEffect(() => {
  const initializeData = async () => {
    try {
      // Load all at once (parallel)
      await Promise.all([
        checkUser(),
        loadEarnings(),
        loadBookings()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };
  initializeData();
}, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

const loadEarnings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('pilot_earnings')
      .select('*')
      .eq('user_id', user.id)  // Add user filter
      .single();
    
    if (error) {
      console.log('No earnings yet');
      return;
    }
    
    if (data) {
      setEarnings({
        today: data.today_earnings || 0,
        week: data.week_earnings || 0,
        month: data.month_earnings || 0,
        pending: data.pending_earnings || 0
      });
    }
  } catch (error) {
    console.error('Error loading earnings:', error);
  }
};

  const loadBookings = async () => {
    const { data } = await supabase
      .from('streaming_services')
      .select('*')
      .eq('pilot_id', user?.id)
      .order('event_date', { ascending: true });
    
    setBookings(data || []);
  };

  const generateStreamKey = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stream/key', { method: 'POST' });
      const data = await res.json();
      setStreamKey(data);
      
      // NEW: Generate key and show modal
      const key = 'live_' + Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
      setGeneratedStreamKey(key);
      setShowStreamKeyModal(true); // Show the modal
    } catch (error) {
      console.error('Error generating stream key:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Live Hub - Stream, Book, Earn | BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div className="stream-wrapper">
            {/* Enhanced Header with Earnings */}
            <header style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '10px'
                }}>
                  Live Broadcasting Hub
                </h1>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '18px'
                }}>
                  Stream, Book Events, Manage Storage - All in One Place
                </p>
              </div>

              {/* Earnings Widget */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '300px'
              }}>
                <p style={{ color: '#10b981', marginBottom: '10px', fontSize: '14px' }}>
                  TODAY'S EARNINGS
                </p>
                <p style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                  ${earnings.today.toFixed(2)}
                </p>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Week: </span>
                    <span style={{ color: '#10b981' }}>${earnings.week}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Month: </span>
                    <span style={{ color: '#10b981' }}>${earnings.month}</span>
                  </div>
                  <div>
                    <span style={{ color: '#f59e0b' }}>Pending: </span>
                    <span style={{ color: '#f59e0b' }}>${earnings.pending}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '5px',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)'
            }}>
              <button
                onClick={() => setActiveTab('stream')}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: activeTab === 'stream' ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                🔴 Go Live Now
              </button>
              <button
                onClick={() => setActiveTab('services')}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: activeTab === 'services' ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                📅 Event Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('storage')}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: activeTab === 'storage' ? 'linear-gradient(135deg, #10b981, #34d399)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                ☁️ Cloud Storage ({(storageUsed / 1024).toFixed(1)} GB)
              </button>
            </div>

            {/* STREAM TAB - Your existing content enhanced */}
            {activeTab === 'stream' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '30px'
              }}>
                {/* LEFT COLUMN - Stream Preview */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* Stream Preview Content */}
                    <BrowserStream />
                    
                    {/* Top Controls */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      right: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          background: 'white',
                          borderRadius: '50%',
                          animation: 'blink 1.4s infinite'
                        }}></span>
                        LIVE
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setShowNFTMinting(!showNFTMinting)}
                          style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          🎨 Mint NFT
                        </button>
                        <button
                          onClick={() => setShowFlightCompliance(!showFlightCompliance)}
                          style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ✈️ Flight Compliance
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stream Controls */}
                  <div style={{ padding: '30px' }}>
                    <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Stream Configuration</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                      <input 
                        placeholder="Stream Title" 
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          fontSize: '16px'
                        }}
                      />
                      <select style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}>
                        <option>Select Service Type</option>
                        <option>Personal Stream</option>
                        <option>Event Coverage - $299/hr</option>
                        <option>Real Estate Tour - $199</option>
                        <option>Construction Update - $399</option>
                      </select>
                      <button
                        onClick={generateStreamKey}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '20px',
                          borderRadius: '50px',
                          fontSize: '20px',
                          fontWeight: '600',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
                          opacity: loading ? 0.7 : 1
                        }}
                      >
                        {loading ? '⏳ Generating...' : '🔴 Start Broadcasting'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Revenue Tracker */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '20px',
                    padding: '20px'
                  }}>
                    <h3 style={{ marginBottom: '15px' }}>💰 Live Earnings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Super Chats</p>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$47.50</p>
                      </div>
                      <div>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Viewers</p>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1,234</p>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      background: 'rgba(251, 146, 60, 0.1)',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#fb923c', fontSize: '14px' }}>
                        💎 Go Pro to reduce fees from 30% to 15%
                      </p>
                    </div>
                  </div>

                  <SuperChat 
                    streamId="live_stream_main"
                    currentUser={user}
                    isLive={true}
                  />

                  <LiveChat 
                    streamId="live_stream_main"
                    userId={user?.id}
                    username={user?.email}
                  />

                  {showNFTMinting && (
                    <NFTMinting 
                      streamId="live_stream_main"
                      streamTitle="Drone Flight Stream"
                      pilotAddress="0x123..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* SERVICES TAB - Event Bookings */}
            {activeTab === 'services' && (
              <div style={{
                display: 'grid',
                gap: '30px'
              }}>
                {/* Booking Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px'
                }}>
                  {[
                    { label: 'This Week', value: '3 Events', amount: '$1,197', color: '#3b82f6' },
                    { label: 'This Month', value: '12 Events', amount: '$4,788', color: '#8b5cf6' },
                    { label: 'Avg Per Event', value: '$399', trend: '+12%', color: '#10b981' },
                    { label: 'Next Event', value: 'Tomorrow', time: '2:00 PM', color: '#f59e0b' }
                  ].map((stat, i) => (
                    <div key={i} style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${stat.color}40`,
                      borderRadius: '16px',
                      padding: '20px'
                    }}>
                      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>
                        {stat.label}
                      </p>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>
                        {stat.value}
                      </p>
                      {stat.amount && <p style={{ color: '#10b981', fontSize: '16px', marginTop: '5px' }}>{stat.amount}</p>}
                      {stat.time && <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '5px' }}>{stat.time}</p>}
                      {stat.trend && <p style={{ color: '#10b981', fontSize: '14px', marginTop: '5px' }}>{stat.trend}</p>}
                    </div>
                  ))}
                </div>

                {/* Available Services */}
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Your Live Streaming Services</h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {[
                      {
                        title: 'Event Coverage',
                        price: '$299/hour',
                        description: 'Weddings, concerts, sports',
                        bookings: 47,
                        rating: 4.9,
                        color: '#3b82f6'
                      },
                      {
                        title: 'Real Estate Tours',
                        price: '$199/property',
                        description: 'Live virtual property tours',
                        bookings: 28,
                        rating: 5.0,
                        color: '#8b5cf6'
                      },
                      {
                        title: 'Construction Progress',
                        price: '$999/month',
                        description: 'Weekly progress updates',
                        bookings: 12,
                        rating: 4.8,
                        color: '#10b981'
                      }
                    ].map((service, i) => (
                      <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${service.color}40`,
                        borderRadius: '20px',
                        padding: '25px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${service.color}, ${service.color}80)`
                        }} />
                        
                        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{service.title}</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: service.color, marginBottom: '10px' }}>
                          {service.price}
                        </p>
                        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{service.description}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Total Bookings</p>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{service.bookings}</p>
                          </div>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Rating</p>
                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>⭐ {service.rating}</p>
                          </div>
                        </div>

                        <button style={{
                          width: '100%',
                          padding: '12px',
                          background: `linear-gradient(135deg, ${service.color}, ${service.color}80)`,
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          Manage Service
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Bookings */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '25px'
                }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>📅 Upcoming Bookings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {bookings.slice(0, 5).map((booking, i) => (
                      <div key={i} style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '12px',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: '600' }}>{booking.title}</p>
                          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                            {new Date(booking.event_date).toLocaleDateString()} at {booking.location}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                            ${booking.pilot_earnings}
                          </p>
                          <button style={{
                            padding: '6px 12px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STORAGE TAB - Cloud Storage & Delivery */}
            {activeTab === 'storage' && (
              <div style={{
                display: 'grid',
                gap: '30px'
              }}>
                {/* Storage Overview */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  padding: '30px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>☁️ Cloud Storage</h2>
                      <p style={{ color: '#94a3b8' }}>
                        Manage your footage, deliveries, and client files
                      </p>
                    </div>
                    <button style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Upgrade Storage Plan
                    </button>
                  </div>

                  {/* Storage Bar */}
                  <div style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Storage Used</span>
                      <span>{(storageUsed / 1024).toFixed(1)} GB / 100 GB</span>
                    </div>
                    <div style={{
                      height: '20px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(storageUsed / 1024 / 100) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #34d399)',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* Storage Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginTop: '30px'
                  }}>
                    {[
                      { label: 'Total Files', value: '1,234', icon: '📁' },
                      { label: 'Deliveries', value: '89', icon: '📦' },
                      { label: 'Downloads', value: '3,456', icon: '⬇️' },
                      { label: 'Revenue', value: '$234', icon: '💰' }
                    ].map((stat, i) => (
                      <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.icon}</div>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{stat.label}</p>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Delivery Methods</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px'
                  }}>
                    {[
                      { name: 'Direct Download', fee: 'Free', speed: 'Instant', icon: '⬇️' },
                      { name: 'Google Drive', fee: '$2', speed: '5 min', icon: '📁' },
                      { name: 'Dropbox', fee: '$2', speed: '5 min', icon: '💧' },
                      { name: 'WeTransfer', fee: '$5', speed: '10 min', icon: '✉️' },
                      { name: 'Physical USB', fee: '$25', speed: '2-3 days', icon: '💾' },
                      { name: 'Rush Delivery', fee: '$10', speed: '1 hour', icon: '🚀' }
                    ].map((method, i) => (
                      <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{method.icon}</div>
                        <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>{method.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '14px' }}>
                          <span>Fee: {method.fee}</span>
                          <span>{method.speed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '25px'
                }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>📦 Recent Deliveries</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { client: 'Smith Wedding', files: 247, size: '18.3 GB', revenue: '$45', status: 'delivered' },
                      { client: 'Downtown Condo Tour', files: 89, size: '6.2 GB', revenue: '$15', status: 'processing' },
                      { client: 'Marathon Event', files: 512, size: '42.1 GB', revenue: '$85', status: 'uploading' }
                    ].map((delivery, i) => (
                      <div key={i} style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '12px',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: '600' }}>{delivery.client}</p>
                          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                            {delivery.files} files • {delivery.size}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: delivery.status === 'delivered' ? 'rgba(16, 185, 129, 0.2)' : 
                                       delivery.status === 'processing' ? 'rgba(251, 146, 60, 0.2)' :
                                       'rgba(59, 130, 246, 0.2)',
                            color: delivery.status === 'delivered' ? '#10b981' :
                                   delivery.status === 'processing' ? '#fb923c' :
                                   '#60a5fa',
                            borderRadius: '20px',
                            fontSize: '12px'
                          }}>
                            {delivery.status}
                          </span>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                            {delivery.revenue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Show Flight Compliance if toggled */}
            {showFlightCompliance && (
              <div style={{ marginTop: '30px' }}>
                <FlightCompliance />
              </div>
            )}
          </div>
        </Layout>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        select option {
          background: #1e293b;
          color: white;
        }
        
        input::placeholder {
          color: #64748b;
        }
      `}</style>

      {/* STREAM KEY MODAL */}
      {showStreamKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '30px',
            padding: '40px',
            maxWidth: '650px',
            width: '90%',
            color: 'white',
            border: '2px solid #00ff88',
            boxShadow: '0 30px 80px rgba(0,255,136,0.4)',
            animation: 'slideIn 0.3s ease'
          }}>
            <h2 style={{ 
              fontSize: '36px', 
              marginBottom: '30px',
              background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}>
              🔑 Your Stream Configuration
            </h2>
            
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '25px',
              border: '1px solid rgba(0,255,136,0.2)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#00ff88',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  RTMP Server:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    value="rtmp://live.bluetubetv.live/live"
                    readOnly
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard('rtmp://live.bluetubetv.live/live')}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#00ff88',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Stream Key:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    value={generatedStreamKey}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#00d4ff',
                      fontSize: '15px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(generatedStreamKey)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
            
            {copied && (
              <div style={{
                background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                color: '#000',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
                animation: 'fadeIn 0.3s ease'
              }}>
                ✅ Copied to clipboard!
              </div>
            )}
            
            <div style={{
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '25px'
            }}>
              <h3 style={{ 
                color: '#00ff88', 
                marginBottom: '15px',
                fontSize: '18px'
              }}>
                📺 Quick Setup for OBS Studio:
              </h3>
              <ol style={{ 
                margin: 0, 
                paddingLeft: '25px', 
                lineHeight: '2',
                color: '#ddd'
              }}>
                <li>Open OBS Studio</li>
                <li>Go to <strong>Settings → Stream</strong></li>
                <li>Service: <strong>Custom</strong></li>
                <li>Server: <code style={{ 
                  background: 'rgba(0,0,0,0.5)', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  color: '#00ff88'
                }}>rtmp://live.bluetubetv.live/live</code></li>
                <li>Stream Key: <code style={{ 
                  background: 'rgba(0,0,0,0.5)', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  color: '#00d4ff'
                }}>{generatedStreamKey.substring(0, 20)}...</code></li>
              </ol>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  const key = 'live_' + Math.random().toString(36).substring(2, 15) + 
                              Math.random().toString(36).substring(2, 15);
                  setGeneratedStreamKey(key);
                }}
                style={{
                  padding: '14px 30px',
                  background: 'transparent',
                  border: '2px solid #00ff88',
                  borderRadius: '30px',
                  color: '#00ff88',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🔄 Regenerate Key
              </button>
              <button
                onClick={() => setShowStreamKeyModal(false)}
                style={{
                  padding: '14px 40px',
                  background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 20px rgba(0,255,136,0.3)'
                }}
              >
                ✓ Start Streaming
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}