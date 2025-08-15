// pages/marketplace.js - Using your existing components
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import JobBoard from '../components/JobBoard'
import JobCard from '../components/JobCard'
import SponsoredJobCard from '../components/SponsoredJobCard'
import JobPostingForm from '../components/JobPostingForm'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function Marketplace() {
  const { user } = useAuth()
  const router = useRouter()
  const [showPostForm, setShowPostForm] = useState(false)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setJobs(data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="marketplace-container">
        <div className="marketplace-header">
          <h1>Drone Job Marketplace</h1>
          <p>Find professional drone pilots or post your job</p>
          {user && (
            <button 
              onClick={() => setShowPostForm(!showPostForm)}
              className="post-job-btn"
            >
              Post a Job
            </button>
          )}
        </div>

        {showPostForm && user && (
          <JobPostingForm 
            onClose={() => setShowPostForm(false)}
            onSuccess={fetchJobs}
          />
        )}

        <JobBoard jobs={jobs} loading={loading} />
      </div>

      <style jsx>{`
        .marketplace-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }
        .marketplace-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .marketplace-header h1 {
          font-size: 3rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        .marketplace-header p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }
        .post-job-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .post-job-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </Layout>
  )
}