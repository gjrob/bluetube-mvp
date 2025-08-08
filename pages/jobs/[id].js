import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      // Fetch job details
      const jobResponse = await fetch(`/api/jobs?job_id=${id}`);
      const jobData = await jobResponse.json();
      
      // Fetch bids for this job
      const bidsResponse = await fetch(`/api/jobs/${id}/bids`);
      const bidsData = await bidsResponse.json();
      
      setJob(jobData.jobs?.[0] || null);
      setBids(bidsData.bids || []);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{padding: '40px', textAlign: 'center'}}>Loading job details...</div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div style={{padding: '40px', textAlign: 'center'}}>Job not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
        <h1 style={{fontSize: '28px', marginBottom: '20px'}}>{job.title}</h1>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{marginBottom: '16px'}}>
            <strong>Budget:</strong> ${job.budget}
          </div>
          <div style={{marginBottom: '16px'}}>
            <strong>Location:</strong> {job.location}
          </div>
          <div style={{marginBottom: '16px'}}>
            <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
          </div>
          <div style={{marginBottom: '16px'}}>
            <strong>Description:</strong>
          </div>
          <p style={{lineHeight: '1.6'}}>{job.description}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{marginBottom: '16px'}}>Proposals ({bids.length})</h3>
          {bids.length === 0 ? (
            <p style={{color: '#6B7280'}}>No proposals yet.</p>
          ) : (
            bids.map((bid, index) => (
              <div key={bid.id} style={{
                padding: '16px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{fontWeight: '600', marginBottom: '8px'}}>
                  Pilot: {bid.pilot_id} - ${bid.bid_amount}
                </div>
                <p style={{lineHeight: '1.5'}}>{bid.proposal}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}