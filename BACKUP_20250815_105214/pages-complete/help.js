// pages/help.js - SEPARATE FILE
import Layout from '../components/Layout'

export default function Help() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Help Center</h1>
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Frequently Asked Questions</h2>
          
          <details style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            backgroundColor: '#1E293B', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
              How do I start streaming?
            </summary>
            <p style={{ marginTop: '10px', color: '#94A3B8' }}>
              Go to /live, click "Generate Stream Key", then use OBS or click "Start Streaming" for browser streaming.
            </p>
          </details>
          
          <details style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            backgroundColor: '#1E293B', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
              How do payments work?
            </summary>
            <p style={{ marginTop: '10px', color: '#94A3B8' }}>
              Clients pay when posting jobs. Pilots receive payment 48 hours after job completion.
            </p>
          </details>
          
          <details style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            backgroundColor: '#1E293B', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
              What equipment do I need?
            </summary>
            <p style={{ marginTop: '10px', color: '#94A3B8' }}>
              Any drone with camera capabilities. For streaming, you'll need OBS or similar software.
            </p>
          </details>
          
          <details style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            backgroundColor: '#1E293B', 
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
              How do I become a verified pilot?
            </summary>
            <p style={{ marginTop: '10px', color: '#94A3B8' }}>
              Complete 5 jobs with 4+ star ratings and upload your Part 107 certificate.
            </p>
          </details>
        </div>
      </div>
    </Layout>
  )
}