// pages/blog.js - SEPARATE FILE
import Layout from '../components/Layout'

export default function Blog() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>BlueTubeTV Blog</h1>
        
        <article style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#1E293B', 
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>
            Launch Announcement: BlueTubeTV is Live!
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '15px' }}>August 8, 2025</p>
          <p style={{ color: '#CBD5E1' }}>
            We're excited to announce the launch of BlueTubeTV - the premier platform for drone pilots to stream, 
            earn, and connect with clients worldwide.
          </p>
          <a href="#" style={{ color: '#3B82F6', marginTop: '10px', display: 'inline-block' }}>
            Read more →
          </a>
        </article>
        
        <article style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#1E293B', 
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>
            How to Maximize Your Earnings as a Drone Pilot
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '15px' }}>August 5, 2025</p>
          <p style={{ color: '#CBD5E1' }}>
            Learn the top strategies our most successful pilots use to earn $5,000+ per month on BlueTubeTV.
          </p>
          <a href="#" style={{ color: '#3B82F6', marginTop: '10px', display: 'inline-block' }}>
            Read more →
          </a>
        </article>
        
        <article style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#1E293B', 
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>
            New Feature: Live Event Streaming Services
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '15px' }}>August 1, 2025</p>
          <p style={{ color: '#CBD5E1' }}>
            Introducing our new live streaming service marketplace. Book drone pilots for weddings, sports events, and more!
          </p>
          <a href="#" style={{ color: '#3B82F6', marginTop: '10px', display: 'inline-block' }}>
            Read more →
          </a>
        </article>
      </div>
    </Layout>
  )
}