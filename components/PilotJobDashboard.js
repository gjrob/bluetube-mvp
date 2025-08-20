import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PilotJobDashboard = ({ pilotId }) => {
  const [jobs, setJobs] = useState({
    active: [],
    completed: [],
    bids: []
  });
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchPilotJobs();
  }, [pilotId]);

  const fetchPilotJobs = async () => {
    try {
      // Fetch jobs assigned to this pilot
      const activeResponse = await fetch(`/api/jobs?pilot_id=${pilotId}&status=in_progress`);
      const completedResponse = await fetch(`/api/jobs?pilot_id=${pilotId}&status=completed`);
      const bidsResponse = await fetch(`/api/jobs/bids?pilot_id=${pilotId}`);

      setJobs({
        active: activeResponse.ok ? (await activeResponse.json()).jobs || [] : [],
        completed: completedResponse.ok ? (await completedResponse.json()).jobs || [] : [],
        bids: bidsResponse.ok ? (await bidsResponse.json()).bids || [] : []
      });
    } catch (error) {
      console.error('Failed to fetch pilot jobs:', error);
    }
  };

  const completeJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_pilot_id: pilotId })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Job completed! You earned $${result.payout_info?.pilot_payout || 'TBD'}`);
        fetchPilotJobs(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to complete job:', error);
    }
  };

  const TabButton = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '12px 24px',
        backgroundColor: activeTab === tab ? '#3B82F6' : 'transparent',
        color: activeTab === tab ? 'white' : '#6B7280',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
      }}
    >
      {label} ({count})
    </button>
  );

  const JobCard = ({ job, type }) => (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>
        {job.title}
      </h3>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '14px',
        color: '#6B7280',
        marginBottom: '12px'
      }}>
        <span>💰 ${job.budget || job.bid_amount}</span>
        <span>📍 {job.location}</span>
        <span>📅 {new Date(job.deadline || job.created_at).toLocaleDateString()}</span>
      </div>

      <p style={{marginBottom: '16px', color: '#4B5563'}}>
        {job.description || job.proposal}
      </p>

      {type === 'active' && (
        <button
          onClick={() => completeJob(job.id)}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Mark Complete & Get Paid
        </button>
      )}

      {type === 'completed' && (
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          display: 'inline-block'
        }}>
          ✅ Completed - Earned $375
        </div>
      )}
    </div>
  );

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
      <h2 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px'}}>
        🚁 My Jobs Dashboard
      </h2>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '24px'
      }}>
        <TabButton tab="active" label="Active Jobs" count={jobs.active.length} />
        <TabButton tab="completed" label="Completed" count={jobs.completed.length} />
        <TabButton tab="bids" label="My Bids" count={jobs.bids.length} />
      </div>

      <div>
        {activeTab === 'active' && (
          <div>
            {jobs.active.length === 0 ? (
              <p style={{textAlign: 'center', color: '#6B7280', padding: '40px'}}>
                No active jobs. <Link href="/jobs">Browse available jobs</Link>
              </p>
            ) : (
              jobs.active.map(job => (
                <JobCard key={job.id} job={job} type="active" />
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            {jobs.completed.map(job => (
              <JobCard key={job.id} job={job} type="completed" />
            ))}
          </div>
        )}

        {activeTab === 'bids' && (
          <div>
            {jobs.bids.map(bid => (
              <JobCard key={bid.id} job={bid} type="bid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PilotJobDashboard;