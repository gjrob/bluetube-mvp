// pages/careers.js
import Layout from '../components/Layout'

export default function Careers() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Join BlueTubeTV</h1>
        <p style={{ fontSize: '20px', marginBottom: '40px' }}>
          We're building the future of drone streaming and aerial services
        </p>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '12px' }}>
            <h2>Full Stack Developer</h2>
            <p>Remote • Full-time</p>
            <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none' }}>
              Apply Now
            </button>
          </div>
          
          <div style={{ padding: '20px', backgroundColor: '#1E293B', borderRadius: '12px' }}>
            <h2>Drone Operations Manager</h2>
            <p>Atlanta, GA • Full-time</p>
            <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none' }}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}


