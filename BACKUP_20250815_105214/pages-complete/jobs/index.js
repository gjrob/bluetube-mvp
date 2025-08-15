import { useState, useEffect } from 'react';
import JobBoard from '../../components/JobBoard';
import Layout from '../../components/Layout';

export default function JobsPage() {
  const [currentPilotId, setCurrentPilotId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with your actual auth system
    // For now, using test pilot (you can adapt this)
    const pilotId = 'test_pilot'; // Replace with real auth logic
    setCurrentPilotId(pilotId);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={{display: 'flex', justifyContent: 'center', padding: '60px'}}>
          <div>Loading jobs...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <JobBoard currentPilotId={currentPilotId} />
    </Layout>
  );
}