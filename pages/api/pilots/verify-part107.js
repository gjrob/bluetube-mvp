// pages/api/pilots/verify-part107.js
// FAA Part 107 Pilot Verification System

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { certificateNumber, lastName } = req.body;

  // FAA Certificate Format: Typically 10 digits
  const isValidFormat = /^\d{10}$/.test(certificateNumber);
  
  if (!isValidFormat) {
    return res.status(400).json({ 
      error: 'Invalid certificate format. Must be 10 digits.' 
    });
  }

  try {
    // In production, this would call FAA's Airmen Registry API
    // For now, we'll validate format and mark as pending verification
    
    const verificationResult = {
      certificateNumber,
      pilotName: lastName,
      status: 'pending_verification',
      certType: 'Part 107 - Remote Pilot',
      verifiedAt: new Date().toISOString(),
      // Add badge once verified
      badge: {
        type: 'FAA_CERTIFIED',
        level: 'professional',
        icon: '✈️'
      }
    };

    // Save to database
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    await supabase
      .from('pilot_certifications')
      .insert({
        user_id: req.body.userId,
        certificate_number: certificateNumber,
        pilot_name: lastName,
        cert_type: 'part107',
        verified: false, // Will be true after FAA API verification
        verification_date: new Date().toISOString()
      });

    res.status(200).json({
      success: true,
      message: 'Certificate submitted for verification',
      data: verificationResult
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}

// ============================================
// Component: PilotVerificationModal.js
// Add this to your dashboard

import { useState } from 'react';

export function PilotVerificationModal({ isOpen, onClose, onVerified }) {
  const [certNumber, setCertNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/pilots/verify-part107', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateNumber: certNumber,
          lastName: lastName,
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onVerified(data.data);
        alert('✅ FAA Certificate submitted for verification!');
        onClose();
      }
    } catch (error) {
      alert('Verification failed. Please try again.');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '20px' }}>✈️ FAA Part 107 Verification</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Certificate Number (10 digits)
          </label>
          <input
            type="text"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            placeholder="4720482319"
            maxLength="10"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #0080FF',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Last Name (as on certificate)
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Smith"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #0080FF',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleVerify}
            disabled={loading || certNumber.length !== 10}
            style={{
              flex: 1,
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(45deg, #0080FF 0%, #00B4D8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </button>
          
          <button
            onClick={onClose}
            style={{
              padding: '14px 30px',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Your certificate will be verified against the FAA Airmen Registry.
          Verified pilots get a ✈️ badge and priority job listings!
        </p>
      </div>
    </div>
  );
}