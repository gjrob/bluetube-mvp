// pages/privacy.js
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - BlueTubeTV</title>
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
              Privacy Policy
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
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>1. Information We Collect</h2>
                
                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '10px' }}>Information You Provide:</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>Account info (username, email, password)</li>
                  <li>Profile information</li>
                  <li>Payment details (processed by Stripe)</li>
                  <li>Content you upload</li>
                  <li>Comments and messages</li>
                </ul>
                
                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '10px' }}>Automatic Collection:</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Watch history</li>
                  <li>Usage analytics</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>2. How We Use Information</h2>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Provide the service</li>
                  <li>Process payments</li>
                  <li>Send notifications</li>
                  <li>Improve features</li>
                  <li>Prevent fraud</li>
                  <li>Legal compliance</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>3. Information Sharing</h2>
                <p style={{ marginBottom: '10px' }}>We share data with:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>Payment processors (Stripe)</li>
                  <li>Video delivery (Cloudflare)</li>
                  <li>Analytics (anonymous only)</li>
                  <li>Law enforcement (if required)</li>
                </ul>
                <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '30px' }}>
                  We DON'T sell personal data.
                </p>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>4. Data Security</h2>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Encrypted passwords</li>
                  <li>HTTPS everywhere</li>
                  <li>Regular security updates</li>
                  <li>Limited access controls</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>5. Your Rights</h2>
                <p style={{ marginBottom: '10px' }}>You can:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Access your data</li>
                  <li>Delete your account</li>
                  <li>Export your content</li>
                  <li>Opt-out of emails</li>
                  <li>Request data deletion</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>6. Cookies</h2>
                <p style={{ marginBottom: '10px' }}>We use cookies for:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Login sessions</li>
                  <li>Preferences</li>
                  <li>Analytics</li>
                  <li>Security</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>7. Children</h2>
                <p style={{ marginBottom: '30px' }}>
                  No users under 13. We delete underage accounts.
                </p>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>8. Data Retention</h2>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Active accounts: Kept while active</li>
                  <li>Deleted accounts: Removed within 30 days</li>
                  <li>Backups: Purged within 90 days</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>9. International Users</h2>
                <p style={{ marginBottom: '30px' }}>
                  Data processed in United States. By using service, you consent to transfer.
                </p>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>10. California Rights (CCPA)</h2>
                <p style={{ marginBottom: '10px' }}>California residents can request:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>What data we have</li>
                  <li>Deletion of data</li>
                  <li>Opt-out of "sales" (we don't sell)</li>
                </ul>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>11. Changes</h2>
                <p style={{ marginBottom: '30px' }}>
                  We'll notify of major changes via email.
                </p>
                
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>12. Contact</h2>
                <p style={{ marginBottom: '40px' }}>
                  Email: <Link href="mailto:privacy@bluetubetv.live"><span style={{ color: '#60a5fa' }}>
                    privacy@bluetubetv.live
                  </span></Link>
                </p>
              </div>
            </div>
            
            {/* Community Guidelines Section */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginTop: '40px'
            }}>
              <h2 style={{
                fontSize: '36px',
                background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                Community Guidelines
              </h2>
              
              <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                <h3 style={{ color: '#10b981', marginBottom: '15px' }}>✅ Be Respectful</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No harassment or bullying</li>
                  <li>No hate speech</li>
                  <li>Respect other creators</li>
                  <li>Keep comments constructive</li>
                </ul>
                
                <h3 style={{ color: '#10b981', marginBottom: '15px' }}>🛡️ Be Safe</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No dangerous drone flying</li>
                  <li>Follow local laws</li>
                  <li>No privacy violations</li>
                  <li>Protect minors</li>
                </ul>
                
                <h3 style={{ color: '#10b981', marginBottom: '15px' }}>💯 Be Honest</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No impersonation</li>
                  <li>No misleading content</li>
                  <li>Disclose sponsorships</li>
                  <li>No manipulation</li>
                </ul>
                
                <h3 style={{ color: '#ef4444', marginBottom: '15px' }}>⚠️ Consequences</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>Warning → Timeout → Ban</li>
                  <li>Severe violations = instant ban</li>
                  <li>Appeals: <Link href="mailto:support@bluetubetv.live"><span style={{ color: '#60a5fa' }}>
                    support@bluetubetv.live
                  </span></Link></li>
                </ul>
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