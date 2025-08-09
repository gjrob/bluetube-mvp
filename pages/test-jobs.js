// pages/test-jobs.js
import { useState, useEffect } from 'react'

export default function TestJobs() {
  const [jobs, setJobs] = useState([])
  const [message, setMessage] = useState('')

  // Fetch jobs
  const fetchJobs = async () => {
    const res = await fetch('/api/jobs')
    const data = await res.json()
    setJobs(data.jobs || [])
    setMessage(`Found ${data.jobs?.length || 0} jobs`)
  }

  // Create test job
  const createJob = async () => {
    setMessage('Creating job...')
    
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Drone Job - ' + new Date().toLocaleTimeString(),
        description: 'This is a test job for aerial photography',
        budget: 500,
        location: 'Wilmington, NC',
        deadline: '2025-03-01',
        requirements: ['Part 107', '4K Camera'],
        job_type: 'custom'
      })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      setMessage('Job created successfully! Payment required: $' + (data.payment?.posting_fee || 0))
      fetchJobs()
    } else {
      setMessage('Error: ' + data.error)
    }
  }

  // Submit proposal - Fixed duplicate code bug
  const submitProposal = async (jobId) => {
    console.log('Submitting proposal for job:', jobId) // Debug log
    
    if (!jobId) {
      setMessage('Error: No job ID provided')
      return
    }
    
    const res = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: jobId,
        bid_amount: 450,
        cover_letter: 'I am perfect for this job!',
        estimated_duration: '4 hours',
        availability_date: '2025-03-01'
      })
    })
    
    const data = await res.json()
    console.log('Proposal response:', data) // Debug log
    setMessage(res.ok ? 'Proposal submitted!' : 'Error: ' + data.error)
  }

  useEffect(() => {
    fetchJobs()
  }, [])
const fetchAllJobs = async () => {
  const res = await fetch('/api/jobs?status=pending_payment')
  const data = await res.json()
  setJobs(data.jobs || [])
  setMessage(`Found ${data.jobs?.length || 0} pending payment jobs`)
}
  return (
    <div style={{ padding: '40px', backgroundColor: '#0F172A', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Test Job System</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={createJob}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Create Test Job
        </button>
        
        <button 
          onClick={fetchJobs}
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Refresh Jobs
        </button>

        <button 
          onClick={async () => {
            setMessage('Logging in...')
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: 'garlanrobinson@gmail.com',
                password: 'test123456'
              })
            })
            const data = await res.json()
            setMessage(res.ok ? 'Logged in successfully!' : 'Login failed: ' + data.error)
          }}
          style={{
            backgroundColor: '#F59E0B',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Login First
        </button>
      </div>

      {message && (
        <div style={{
          padding: '16px',
          backgroundColor: '#1E293B',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Current Jobs:</h2>
        {jobs.length === 0 ? (
          <p>No jobs found. Create one above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {jobs.map(job => (
              <div key={job.id} style={{
                backgroundColor: '#1E293B',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #374151'
              }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{job.title}</h3>
                <p style={{ color: '#94A3B8', marginBottom: '12px' }}>{job.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#10B981', fontSize: '24px' }}>${job.budget}</span>
                  <button
                    onClick={() => submitProposal(job.id)}
                    style={{
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}