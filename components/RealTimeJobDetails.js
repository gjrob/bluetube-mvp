import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function RealTimeJobDetails({ jobId, initialProposals = [] }) {
  const [proposals, setProposals] = useState(initialProposals)
  const [newProposalAlert, setNewProposalAlert] = useState(false)

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'proposals',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          // Add new proposal with animation
          setProposals(prev => [...prev, payload.new])
          setNewProposalAlert(true)
          setTimeout(() => setNewProposalAlert(false), 3000)
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'proposals',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          // Update existing proposal
          setProposals(prev => 
            prev.map(p => p.id === payload.new.id ? payload.new : p)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId])

  return (
    <div>
      {newProposalAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          🔔 New proposal received!
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {proposals.map((proposal, index) => (
          <div
            key={proposal.id}
            style={{
              backgroundColor: '#1E293B',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
              animation: index === proposals.length - 1 ? 'fadeIn 0.5s ease-out' : 'none'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h4 style={{ color: 'white', fontSize: '18px' }}>
                {proposal.pilot_profiles?.full_name}
              </h4>
              <span style={{
                color: '#10B981',
                fontSize: '20px',
                fontWeight: '700'
              }}>
                ${proposal.bid_amount}
              </span>
            </div>
            
            <p style={{
              color: '#94A3B8',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {proposal.cover_letter}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}