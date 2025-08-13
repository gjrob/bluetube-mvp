// pages/delete-account.js
import { useState } from 'react'
import Link from 'next/link'

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        color: '#1a202c'
      }}>
        <h1 style={{
          fontSize: '36px',
          marginBottom: '20px',
          color: '#0284c7'
        }}>
          🗑️ Delete Your Account & Data
        </h1>

        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#dc2626', marginTop: 0 }}>⚠️ Warning</h3>
          <p>Deleting your account will permanently remove:</p>
          <ul>
            <li>Your profile and account information</li>
            <li>All uploaded videos and streams</li>
            <li>Your earnings and payment history</li>
            <li>Job listings and applications</li>
            <li>All associated data from our servers</li>
          </ul>
          <p><strong>This action cannot be undone.</strong></p>
        </div>

        <h2 style={{ color: '#0284c7', marginTop: '40px' }}>
          How to Delete Your Data
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <h3>Option 1: Automatic Deletion (Logged In Users)</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>Log in to your BlueTubeTV account</li>
            <li>Go to Settings → Privacy</li>
            <li>Click "Delete My Account"</li>
            <li>Confirm your password</li>
            <li>Click "Permanently Delete"</li>
          </ol>
          
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                padding: '12px 30px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Delete My Account
            </button>
          ) : (
            <div style={{
              background: '#fee',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <p><strong>Are you absolutely sure?</strong></p>
              <p>Type "DELETE" to confirm:</p>
              <input
                type="text"
                placeholder="Type DELETE"
                style={{
                  padding: '10px',
                  width: '200px',
                  marginRight: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
              <button
                style={{
                  padding: '10px 20px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Confirm Deletion
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Option 2: Email Request</h3>
          <p>Send an email to: <strong>privacy@bluetubetv.live</strong></p>
          <p>Include in your email:</p>
          <ul>
            <li>Your account email address</li>
            <li>Your username</li>
            <li>Request: "Please delete my account and all associated data"</li>
          </ul>
          <p>We will process your request within 30 days and send confirmation.</p>
        </div>

        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#16a34a', marginTop: 0 }}>
            📊 Data Retention Policy
          </h3>
          <ul>
            <li><strong>Account Data:</strong> Deleted immediately upon request</li>
            <li><strong>Videos/Streams:</strong> Removed within 24 hours</li>
            <li><strong>Backups:</strong> Purged within 30 days</li>
            <li><strong>Legal Records:</strong> Retained only as required by law</li>
            <li><strong>Payment Records:</strong> Kept for tax purposes (7 years)</li>
          </ul>
        </div>

        <div style={{
          borderTop: '1px solid #e5e5e5',
          marginTop: '40px',
          paddingTop: '20px'
        }}>
          <h3>Contact Us</h3>
          <p>
            For questions about data deletion or privacy, contact:<br/>
            📧 Email: privacy@bluetubetv.live<br/>
            📍 Data Protection Officer: DPO@bluetubetv.live
          </p>
        </div>

        <div style={{
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <Link href="/" style={{
            color: '#0284c7',
            textDecoration: 'none',
            marginRight: '20px'
          }}>
            ← Back to Home
          </Link>
          <Link href="/privacy" style={{
            color: '#0284c7',
            textDecoration: 'none'
          }}>
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}