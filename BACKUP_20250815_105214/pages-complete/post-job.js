// pages/post-job.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import JobPostingForm from '../components/JobPostingForm'
import ListingUpgrade from '../components/ListingUpgrade'
import { useAuth } from '../hooks/useAuth'

export default function PostJob() {
  const { user } = useAuth()
  const router = useRouter()
  const [jobPosted, setJobPosted] = useState(false)
  const [jobId, setJobId] = useState(null)

  if (!user) {
    router.push('/login')
    return null
  }

  const handleJobPosted = (newJobId) => {
    setJobPosted(true)
    setJobId(newJobId)
  }

  return (
    <Layout>
      <div className="post-job-container">
        <h1>Post a Drone Job</h1>
        
        {!jobPosted ? (
          <JobPostingForm onSuccess={handleJobPosted} />
        ) : (
          <div className="success-section">
            <h2>✅ Job Posted Successfully!</h2>
            <p>Your job is now live on the marketplace</p>
            <ListingUpgrade jobId={jobId} />
            <button 
              onClick={() => router.push('/marketplace')}
              className="view-job-btn"
            >
              View in Marketplace
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .post-job-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
        .success-section {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .view-job-btn {
          margin-top: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }
      `}</style>
    </Layout>
  )
}