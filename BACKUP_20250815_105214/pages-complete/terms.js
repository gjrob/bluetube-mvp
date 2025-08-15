// pages/terms.js
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Terms of Service
            </h1>
            
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                Last Updated: July 25, 2025
              </p>
              
              <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                {/* Add your terms content here following the same pattern */}
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>1. Acceptance of Terms</h2>
                <p style={{ marginBottom: '30px' }}>
                  By using BlueTubeTV, you agree to these Terms of Service.
                </p>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>2. Service Description</h2>
                <p style={{ marginBottom: '30px' }}>
                  BlueTubeTV is a live drone streaming platform that allows users to broadcast and watch aerial footage.
                </p>
                
                {/* Continue with your terms content... */}
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '40px',
              color: '#94a3b8'
            }}>
              <p>Questions? Contact us at <Link href="mailto:legal@bluetubetv.live"><span style={{ color: '#60a5fa' }}>
                legal@bluetubetv.live
              </span></Link></p>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}