import React, { useState } from 'react';
import { Play, Settings, Wifi, Camera, DollarSign, Users, ChevronRight, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function SetupGuide() {
  const [activeTab, setActiveTab] = useState('streaming');

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '40px 20px',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '20px',
    },
    tabContainer: {
      display: 'flex',
      gap: '20px',
      marginBottom: '40px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '12px 24px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '16px',
    },
    activeTab: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '1px solid transparent',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '30px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    stepNumber: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
      marginBottom: '20px',
    },
    codeBlock: {
      background: 'rgba(15, 23, 42, 0.7)',
      padding: '20px',
      borderRadius: '12px',
      fontFamily: 'monospace',
      fontSize: '14px',
      marginBottom: '20px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      overflow: 'auto',
    },
    button: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
      textDecoration: 'none',
    },
    buttonSecondary: {
      color: '#60a5fa',
      textDecoration: 'none',
      padding: '12px 24px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '10px',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      background: 'rgba(59, 130, 246, 0.1)',
    },
    resourceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
    },
  };

  const tabs = [
    { id: 'streaming', label: '🎥 Live Streaming', icon: Play },
    { id: 'pilot', label: '🚁 Pilot Setup', icon: Settings },
    { id: 'jobs', label: '💼 Job System', icon: DollarSign },
  ];

  return (
    <>
      <Head>
        <title>Setup Guide - BlueTubeTV</title>
      </Head>
      <Layout>
        <div style={styles.container}>
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>Setup Guide</h1>
              <p style={{ fontSize: '20px', color: '#94a3b8' }}>
                Everything you need to get started on BlueTubeTV
              </p>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabContainer}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab.id ? styles.activeTab : {})
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Streaming Setup */}
            {activeTab === 'streaming' && (
              <>
                {/* Quick Start */}
                <div style={styles.card}>
                  <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#60a5fa' }}>
                    🚀 Quick Start Streaming
                  </h2>
                  
                  <div style={{ marginBottom: '40px' }}>
                    <div style={styles.stepNumber}>1</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Generate Your Stream Key</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Go to the Live page and click "Generate Stream Key" to get your unique streaming credentials.
                    </p>
                    <a href="/live" style={styles.button}>
                      Generate Stream Key
                      <ChevronRight size={20} />
                    </a>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <div style={styles.stepNumber}>2</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Configure Your Streaming Software</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Use these settings in OBS, Streamlabs, or your drone app:
                    </p>
                    <div style={styles.codeBlock}>
                      <div>Server: rtmp://rtmp.livepeer.com/live</div>
                      <div>Stream Key: [Your generated key]</div>
                      <div>Resolution: 1920x1080 (recommended)</div>
                      <div>Bitrate: 2500-4000 Kbps</div>
                    </div>
                  </div>

                  <div>
                    <div style={styles.stepNumber}>3</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Start Broadcasting</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Once configured, start streaming and view your live feed on your stream page.
                    </p>
                    <a href="/dashboard" style={styles.button}>
                      🎥 Go to Dashboard
                    </a>
                  </div>
                </div>

                {/* OBS Setup */}
                <div style={styles.card}>
                  <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#3b82f6' }}>
                    📺 OBS Studio Setup
                  </h2>
                  <ol style={{ color: '#94a3b8', lineHeight: '1.8' }}>
                    <li style={{ marginBottom: '15px' }}>
                      <strong style={{ color: 'white' }}>Download OBS Studio</strong> from 
                      <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer" 
                         style={{ color: '#60a5fa', marginLeft: '5px' }}>obsproject.com</a>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      <strong style={{ color: 'white' }}>Add Video Source:</strong> Click + in Sources → Video Capture Device
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      <strong style={{ color: 'white' }}>Configure Stream:</strong> Settings → Stream → Service: Custom
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      <strong style={{ color: 'white' }}>Enter BlueTubeTV Settings:</strong> Use the server and key from Step 1
                    </li>
                    <li>
                      <strong style={{ color: 'white' }}>Start Streaming:</strong> Click "Start Streaming" in OBS
                    </li>
                  </ol>
                </div>

                {/* Drone Streaming */}
                <div style={styles.card}>
                  <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#8b5cf6' }}>
                    🚁 Drone Streaming Setup
                  </h2>
                  <div style={styles.resourceGrid}>
                    <div>
                      <h3 style={{ color: '#a78bfa', marginBottom: '15px', fontSize: '20px' }}>
                        DJI Drones
                      </h3>
                      <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          DJI Fly app supports RTMP streaming
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Go to Settings → Live Broadcast
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Select "RTMP" and enter BlueTubeTV details
                        </li>
                        <li>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Supports Mavic, Air, and Mini series
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 style={{ color: '#a78bfa', marginBottom: '15px', fontSize: '20px' }}>
                        Other Drones
                      </h3>
                      <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Use HDMI output to capture card
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Connect capture card to computer
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Stream via OBS or similar software
                        </li>
                        <li>
                          <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', color: '#10b981' }} />
                          Works with Autel, Parrot, and others
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Additional Resources */}
                <div style={styles.card}>
                  <h2 style={{ color: '#60a5fa', marginBottom: '30px', fontSize: '24px' }}>
                    Additional Resources
                  </h2>
                  <div style={styles.resourceGrid}>
                    <div>
                      <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '18px' }}>
                        🎯 Streaming Tips
                      </h3>
                      <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px' }}>• Use a stable internet connection (5+ Mbps upload)</li>
                        <li style={{ marginBottom: '8px' }}>• Stream in well-lit conditions for best quality</li>
                        <li style={{ marginBottom: '8px' }}>• Test your stream privately before going live</li>
                        <li>• Engage with viewers through live chat</li>
                      </ul>
                    </div>
                    <div>
                      <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '18px' }}>
                        🚁 Drone Integration
                      </h3>
                      <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '8px' }}>• DJI Fly app supports RTMP streaming</li>
                        <li style={{ marginBottom: '8px' }}>• Use HDMI capture for professional drones</li>
                        <li style={{ marginBottom: '8px' }}>• Consider using a dedicated streaming device</li>
                        <li>• Ensure drone compliance with local regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pilot Setup Tab */}
            {activeTab === 'pilot' && (
              <>
                <div style={styles.card}>
                  <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#60a5fa' }}>
                    🚁 Becoming a BlueTubeTV Pilot
                  </h2>
                  
                  <div style={{ marginBottom: '40px' }}>
                    <div style={styles.stepNumber}>1</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Create Your Profile</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Register as a pilot and complete your professional profile with certifications and equipment.
                    </p>
                    <a href="/pilot-setup" style={styles.button}>
                      Start Registration
                      <ChevronRight size={20} />
                    </a>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <div style={styles.stepNumber}>2</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Upload Portfolio</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Showcase your best work to attract clients. Include variety: real estate, events, inspections.
                    </p>
                  </div>

                  <div style={{ marginBottom: '40px' }}>
                    <div style={styles.stepNumber}>3</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Set Your Rates</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Configure your hourly rate and service packages. Average pilots earn $150+ per job.
                    </p>
                  </div>

                  <div>
                    <div style={styles.stepNumber}>4</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Start Earning</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                      Browse available jobs, submit proposals, and start building your reputation.
                    </p>
                    <a href="/jobs" style={styles.button}>
                      Browse Jobs
                      <ChevronRight size={20} />
                    </a>
                  </div>
                </div>
              </>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <>
                <div style={styles.card}>
                  <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#60a5fa' }}>
                    💼 Job Marketplace Guide
                  </h2>
                  
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#3b82f6' }}>
                      For Pilots
                    </h3>
                    <div style={styles.resourceGrid}>
                      <div>
                        <h4 style={{ marginBottom: '15px' }}>Finding Jobs</h4>
                        <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '8px' }}>• Browse jobs by location and category</li>
                          <li style={{ marginBottom: '8px' }}>• Filter by price range and urgency</li>
                          <li style={{ marginBottom: '8px' }}>• Submit competitive proposals</li>
                          <li>• Build reputation with reviews</li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '15px' }}>Best Practices</h4>
                        <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '8px' }}>• Respond within 2 hours</li>
                          <li style={{ marginBottom: '8px' }}>• Include portfolio samples</li>
                          <li style={{ marginBottom: '8px' }}>• Clear communication</li>
                          <li>• Deliver on time</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#8b5cf6' }}>
                      For Clients
                    </h3>
                    <div style={styles.resourceGrid}>
                      <div>
                        <h4 style={{ marginBottom: '15px' }}>Posting Jobs</h4>
                        <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '8px' }}>• Describe your project clearly</li>
                          <li style={{ marginBottom: '8px' }}>• Set realistic budgets</li>
                          <li style={{ marginBottom: '8px' }}>• Include location details</li>
                          <li>• Specify deliverables</li>
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '15px' }}>Hiring Tips</h4>
                        <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '8px' }}>• Review pilot portfolios</li>
                          <li style={{ marginBottom: '8px' }}>• Check certifications</li>
                          <li style={{ marginBottom: '8px' }}>• Read past reviews</li>
                          <li>• Communicate requirements</li>
                        </ul>
                      </div>
                    </div>
                    <div style={{ marginTop: '30px' }}>
                      <a href="/jobs/post-job" style={styles.button}>
                        Post a Job
                        <ChevronRight size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Need Help Section */}
            <div style={styles.card}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px', fontSize: '24px', textAlign: 'center' }}>
                Need Help?
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '30px', textAlign: 'center' }}>
                Join our community or check out additional resources
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <a href="/browse" style={styles.buttonSecondary}>
                  👀 Watch Other Streams
                </a>
                
                <a
                  href="https://docs.livepeer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.buttonSecondary}
                >
                  📚 LivePeer Docs →
                </a>

                <a href="/dashboard" style={styles.buttonSecondary}>
                  🎥 Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};