// pages/jobs/[id].js - Frontend page for viewing job details
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import JobCompletionModal from '../../components/JobCompletionModal'
import BidForm from '../../components/BidForm'
import { supabase } from '../../lib/supabase'

export default function JobDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showBidForm, setShowBidForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchJobDetails()
      checkUser()
    }
  }, [id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchJobDetails = async () => {
    try {
      // Fetch from your API route
      const response = await fetch(`/api/jobs/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setJob(data.job)
      } else {
        console.error('Error fetching job:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    // Refresh job details after completion
    await fetchJobDetails()
    setShowCompletionModal(false)
  }

  const handleBidSubmit = async () => {
    await fetchJobDetails()
    setShowBidForm(false)
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading job details...</p>
        </div>
      </Layout>
    )
  }

  if (!job) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Job not found</h2>
          <button onClick={() => router.push('/jobs')}>Back to Jobs</button>
        </div>
      </Layout>
    )
  }

  // Check if current user is the client who posted the job
  const isClient = user && job.client_pilot_id === user.id
  // Check if current user is the assigned pilot
  const acceptedProposal = job.proposals?.find(p => p.status === 'accepted')
  const isAssignedPilot = user && acceptedProposal?.pilot_id === user.id
  // Check if user can bid
  const canBid = user && !isClient && job.status === 'open' && 
                 !job.proposals?.some(p => p.pilot_id === user.id)

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/jobs')}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#3B82F6',
            border: '1px solid #3B82F6',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Back to Jobs
        </button>

        {/* Job Details Card */}
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid #334155'
        }}>
          {/* Job Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {job.title}
              </h1>
              <span style={{
                backgroundColor: `${getStatusColor(job.status)}20`,
                color: getStatusColor(job.status),
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {job.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            {/* Job Meta */}
            <div style={{ display: 'flex', gap: '24px', color: '#94A3B8', fontSize: '16px' }}>
              <span>📍 {job.location}</span>
              <span>💰 ${job.budget} Budget</span>
              <span>📅 Posted {new Date(job.created_at).toLocaleDateString()}</span>
              <span>⏰ {job.duration || 'Flexible'}</span>
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
              Description
            </h2>
            <p style={{ color: '#CBD5E1', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                Requirements
              </h2>
              <ul style={{ color: '#CBD5E1', lineHeight: '1.6' }}>
                {job.requirements.split('\n').map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.required_skills && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                Required Skills
              </h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {job.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#334155',
                      color: '#E2E8F0',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Pilot Info */}
          {acceptedProposal && (
            <div style={{
              backgroundColor: '#0F172A',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                Assigned Pilot
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {acceptedProposal.pilot_profiles?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: 'white', fontSize: '16px' }}>
                    {acceptedProposal.pilot_profiles?.full_name || 'Pilot'}
                  </p>
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                    {acceptedProposal.pilot_profiles?.email}
                  </p>
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                    Bid Amount: ${acceptedProposal.amount}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Completion Button - Only shows for client when job is in progress */}
            {job.status === 'in_progress' && isClient && (
              <button
                onClick={() => setShowCompletionModal(true)}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Mark as Complete & Release Payment
              </button>
            )}

            {/* Submit Bid Button - Only shows for pilots when job is open */}
            {canBid && (
              <button
                onClick={() => setShowBidForm(true)}
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Submit Bid
              </button>
            )}

            {/* View Proposals - Only for client */}
            {isClient && job.proposals?.length > 0 && job.status === 'open' && (
              <button
                onClick={() => router.push(`/jobs/${id}/proposals`)}
                style={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                View {job.proposals.length} Proposals
              </button>
            )}

            {/* Edit Job - Only for client when job is open */}
            {isClient && job.status === 'open' && (
              <button
                onClick={() => router.push(`/jobs/${id}/edit`)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#60A5FA',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #3B82F6',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit Job
              </button>
            )}
          </div>
        </div>

        {/* Proposals Section */}
        {job.proposals && job.proposals.length > 0 && (
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '20px' }}>
              Proposals ({job.proposals.length})
            </h2>
            {job.proposals.map(proposal => (
              <div
                key={proposal.id}
                style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: 'white' }}>
                      {proposal.pilot_profiles?.full_name || 'Anonymous Pilot'}
                    </p>
                    <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                      ${proposal.amount} • {proposal.pilot_profiles?.rating ? `${proposal.pilot_profiles.rating} ★` : 'New Pilot'}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: proposal.status === 'accepted' ? '#10B981' : '#6B7280',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {proposal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Completion Modal */}
        {showCompletionModal && (
          <JobCompletionModal
            job={job}
            onComplete={handleComplete}
            onCancel={() => setShowCompletionModal(false)}
          />
        )}

        {/* Bid Form Modal */}
        {showBidForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <BidForm
                jobId={job.id}
                onSubmit={handleBidSubmit}
                onCancel={() => setShowBidForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'open': return '#3B82F6'
    case 'in_progress': return '#10B981'
    case 'completed': return '#6B7280'
    case 'pending': return '#F59E0B'
    default: return '#6B7280'
  }
}