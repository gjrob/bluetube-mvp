// pages/founders.js - Complete file with all imports
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

const claimFounderSpot = async () => {
  if (!name.trim()) {
    alert('Please enter your pilot name!');
    return;
  }
  
  let currentCount = parseInt(localStorage.getItem('founderCount') || '0');
  
  if (currentCount < 100) {       // <-- Opening brace
    // ... all your localStorage code ...
    
    try {
      // ... fetch code ...
    } catch (error) {
      console.error('Failed to track claim:', error);
    }
    
    setFounderNumber(currentCount);
    setTotalClaimed(currentCount);
  } else {                        // <-- You're missing this closing brace
    alert('Sorry! All 100 founder spots have been claimed.');
  }
};                               // <-- Function closing
  
  // Get current count from localStorage
  let currentCount = parseInt(localStorage.getItem('founderCount') || '0');
  
  if (currentCount < 100) {
    currentCount += 1;
    localStorage.setItem('founderCount', currentCount);
    localStorage.setItem(`founder_${currentCount}`, name);
    localStorage.setItem('myFounderNumber', currentCount);
    
    // NEW CODE - Send to API
    try {
      await fetch('/api/claim-badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name, 
          number: currentCount 
        })
      });
    } catch (error) {
      console.error('Failed to track claim:', error);
    }
    
    setFounderNumber(currentCount);
    setTotalClaimed(currentCount);
  } else {
    alert('Sorry! All 100 founder spots have been claimed.');
  }
  return (
    <>
      <Head>
        <title>Founder Badges - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              🏆 Claim Your Founder Badge!
            </h1>
            
            <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '40px' }}>
              {100 - totalClaimed} spots remaining!
            </p>
            
            {!founderNumber ? (
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}>
                <input 
                  placeholder="Your pilot name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && claimFounderSpot()}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    fontSize: '18px',
                    marginBottom: '30px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    color: 'white',
                    textAlign: 'center'
                  }}
                />
                <button 
                  onClick={claimFounderSpot}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                    color: 'white',
                    padding: '20px 60px',
                    fontSize: '24px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Claim Founder Badge! 🚁
                </button>
                
                <div style={{ marginTop: '40px', fontSize: '14px', color: '#6b7280' }}>
                  <p>✅ 100% FREE - No payment ever</p>
                  <p>✅ Badge appears when profiles launch</p>
                  <p>✅ First 100 pilots only</p>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
                  You're Founder #{founderNumber}!
                </h2>
                <p style={{ fontSize: '18px', color: '#10b981', marginBottom: '30px' }}>
                  Welcome to the exclusive club, {localStorage.getItem(`founder_${founderNumber}`)}!
                </p>
                console.log(`Founder #${currentCount} claimed by ${name} at ${new Date()}`);

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '30px'
                }}>
                  <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                    📸 Screenshot this page as proof!
                  </p>
                  <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                    Your founder badge will appear on your profile when we launch accounts next week.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`I'm BlueTubeTV Founder #${founderNumber}! 🚁🏆`);
                    alert('Copied to clipboard!');
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  📋 Copy Bragging Rights
                </button>
              </div>
            )}
            
            <div style={{ marginTop: '60px', color: '#94a3b8' }}>
              <h3 style={{ marginBottom: '20px' }}>🎁 Founder Benefits:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>✅ Exclusive founder badge on profile</li>
                <li style={{ marginBottom: '10px' }}>✅ Direct input on new features</li>
                <li style={{ marginBottom: '10px' }}>✅ Early access to everything</li>
                <li style={{ marginBottom: '10px' }}>✅ Lifetime recognition</li>
              </ul>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
