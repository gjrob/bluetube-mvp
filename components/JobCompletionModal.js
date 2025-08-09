// components/JobCompletionModal.js
import { useState } from 'react'

export default function JobCompletionModal({ job, onComplete, onCancel }) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const acceptedBid = job.job_bids?.find(bid => bid.status === 'accepted')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/jobs/${job.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      alert(`Job completed! Pilot will receive $${data.payment.pilot_earnings} after 48-hour security hold.`)
      onComplete(data)

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const platformFee = acceptedBid ? acceptedBid.bid_amount * (job.job_type === 'sponsored' ? 0.25 : 0.20) : 0
  const pilotEarnings = acceptedBid ? acceptedBid.bid_amount - platformFee : 0

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '24px',
          marginBottom: '24px'
        }}>
          Complete Job & Release Payment
        </h2>

        {acceptedBid && (
          <div style={{
            backgroundColor: '#0F172A',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>Payment Breakdown</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Job Amount:</span>
                <span style={{ color: 'white' }}>${acceptedBid.bid_amount}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Platform Fee ({job.job_type === 'sponsored' ? '25%' : '20%'}):</span>
                <span style={{ color: '#EF4444' }}>-${platformFee.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                paddingTop: '12px',
                borderTop: '1px solid #374151'
              }}>
                <span style={{ color: 'white', fontWeight: '600' }}>Pilot Receives:</span>
                <span style={{ color: '#10B981', fontSize: '20px', fontWeight: '700' }}>
                  ${pilotEarnings.toFixed(2)}
                </span>
              </div>
            </div>

            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '12px' }}>
              * Funds will be available to pilot after 48-hour security hold
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
              Rate the Pilot's Work
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '32px',
                    cursor: 'pointer',
                    color: star <= rating ? '#F59E0B' : '#374151',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              {rating}/5 stars
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience working with this pilot..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #374151',
                backgroundColor: '#0F172A',
                color: 'white',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          {showConfirm && (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#92400E', fontWeight: '600', marginBottom: '8px' }}>
                ⚠️ Confirm Job Completion
              </p>
              <p style={{ color: '#92400E', fontSize: '14px' }}>
                This action will release ${pilotEarnings.toFixed(2)} to the pilot after a 48-hour hold period. 
                This action cannot be undone.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: showConfirm ? '#10B981' : '#3B82F6',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : showConfirm ? 'Confirm & Release Payment' : 'Complete Job'}
            </button>

            <button
              type="button"
              onClick={showConfirm ? () => setShowConfirm(false) : onCancel}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: '1px solid #374151',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {showConfirm ? 'Back' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}