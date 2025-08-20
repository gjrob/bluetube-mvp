// pages/legal.js
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function Legal() {
  return (
    <>
      <Head>
        <title>Legal - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Terms of Service */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              BlueTubeTV Terms of Service
            </h1>
            
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '40px'
            }}>
              <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                Last Updated: July 25, 2025
              </p>
              
              <div style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>1. Acceptance of Terms</h2>
                <p style={{ marginBottom: '30px' }}>
                  By using BlueTubeTV ("Service"), you agree to these Terms. If you don't agree, don't use the Service.
                </p>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>2. Service Description</h2>
                <p style={{ marginBottom: '30px' }}>
                  BlueTubeTV is a live streaming platform for drone content creators.
                </p>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>3. User Accounts</h2>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>You must be 13+ years old</li>
                  <li>You're responsible for your account security</li>
                  <li>One account per person</li>
                  <li>Accurate information required</li>
                </ul>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>4. Content Ownership & License</h2>
                <p style={{ 
                  marginBottom: '20px', 
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#10b981'
                }}>
                  You retain full ownership of all content you create.
                </p>
                <p style={{ marginBottom: '20px' }}>By uploading to BlueTubeTV, you grant us:</p>
                
                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '15px' }}>Standard License</h3>
                <p style={{ marginBottom: '10px' }}>A worldwide, non-exclusive, royalty-free license to:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>Host, store, and stream your content on our platform</li>
                  <li>Create thumbnails, previews, and technical copies</li>
                  <li>Distribute your content to viewers through our service</li>
                  <li>Enable viewers to watch, share, and interact with your content</li>
                </ul>

                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '15px' }}>Marketing Rights</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>We may use clips up to 30 seconds from your content for promotional purposes</li>
                  <li>All promotional use will include your username/attribution</li>
                  <li>You'll be notified when we feature your content in marketing</li>
                </ul>

                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '15px' }}>Revenue Opportunities</h3>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <p style={{ marginBottom: '10px' }}>If we bring you sponsorship deals, brand partnerships, or licensing opportunities:</p>
                  <ul style={{ marginLeft: '20px', color: '#10b981' }}>
                    <li>You keep 70% of any deals we negotiate for you</li>
                    <li>BlueTubeTV takes 30% as a finder's fee</li>
                    <li>You can always decline any opportunity</li>
                    <li>You can negotiate your own deals with 0% platform fee</li>
                  </ul>
                </div>

                <h3 style={{ color: '#818cf8', marginTop: '20px', marginBottom: '15px' }}>Your Rights</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#10b981' }}>
                  <li>You can delete your content anytime</li>
                  <li>You can download your original files</li>
                  <li>You maintain all copyright</li>
                  <li>You can upload to other platforms</li>
                  <li>License ends when you delete content (except for promotional clips already in use)</li>
                </ul>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>5. Prohibited Content</h2>
                <p style={{ marginBottom: '10px' }}>You cannot upload:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#ef4444' }}>
                  <li>Copyrighted content you don't own</li>
                  <li>Illegal content</li>
                  <li>Harmful or dangerous activities</li>
                  <li>Harassment or hate speech</li>
                  <li>Adult content</li>
                  <li>Misleading information</li>
                </ul>
// In pages/legal.js - Update the monetization section:

<h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>6. Monetization</h2>
<div style={{
  background: 'rgba(251, 191, 36, 0.1)',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '30px'
}}>
  <ul style={{ marginLeft: '20px', color: '#fbbf24' }}>
    <li style={{ fontWeight: 'bold', fontSize: '18px' }}>
      Creators keep 85% of tips and donations
    </li>
    <li>BlueTubeTV takes 15% platform fee</li>
    <li style={{ color: '#10b981' }}>
      Platform fee drops to 5% after securing alternative revenue
    </li>
    <li>Payouts processed weekly</li>
    <li>Minimum payout: $25</li>
    <li>You're responsible for your taxes</li>
  </ul>
</div>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>7. DMCA Policy</h2>
                <p style={{ marginBottom: '10px' }}>We respond to copyright claims. To file a claim:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Email: <Link href="mailto:dmca@bluetubetv.live"><span style={{ color: '#60a5fa' }}>dmca@bluetubetv.live</span></Link></li>
                  <li>Include: URL, proof of ownership, contact info</li>
                  <li>False claims may result in account termination</li>
                </ul>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>8. Termination</h2>
                <p style={{ marginBottom: '10px' }}>We can terminate accounts that:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>Violate these terms</li>
                  <li>Engage in fraud</li>
                  <li>Harm the platform</li>
                  <li>Are inactive for 12+ months</li>
                </ul>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>9. Disclaimer</h2>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '30px'
                }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>THE SERVICE IS PROVIDED "AS IS". WE DON'T GUARANTEE:</p>
                  <ul style={{ marginLeft: '20px', color: '#f87171' }}>
                    <li>Continuous operation</li>
                    <li>Error-free streaming</li>
                    <li>Content accuracy</li>
                    <li>Specific results</li>
                  </ul>
                </div>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>10. Limitation of Liability</h2>
                <p style={{ marginBottom: '10px' }}>We're not liable for:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#cbd5e1' }}>
                  <li>Lost profits or revenue</li>
                  <li>Content loss</li>
                  <li>Service interruptions</li>
                  <li>Third-party actions</li>
                </ul>
                <p style={{ marginBottom: '30px', fontWeight: 'bold' }}>
                  Maximum liability: $100 or fees paid in last 12 months.
                </p>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>11. Changes</h2>
                <p style={{ marginBottom: '30px' }}>
                  We can update these terms. Continued use means acceptance.
                </p>

                <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>12. Contact</h2>
                <p>
                  Email: <Link href="mailto:legal@bluetubetv.live"><span style={{ color: '#60a5fa' }}>legal@bluetubetv.live</span></Link>
                </p>
              </div>
            </div>

            {/* Privacy Policy */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              BlueTubeTV Privacy Policy
            </h1>
            
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '40px'
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
                <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '30px', fontSize: '18px' }}>
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
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#10b981' }}>
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
                <p>
                  Email: <Link href="mailto:privacy@bluetubetv.live"><span style={{ color: '#60a5fa' }}>privacy@bluetubetv.live</span></Link>
                </p>
              </div>
            </div>

            {/* Community Guidelines */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
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
                <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '24px' }}>✅ Be Respectful</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No harassment or bullying</li>
                  <li>No hate speech</li>
                  <li>Respect other creators</li>
                  <li>Keep comments constructive</li>
                </ul>
                
                <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '24px' }}>🛡️ Be Safe</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No dangerous drone flying</li>
                  <li>Follow local laws</li>
                  <li>No privacy violations</li>
                  <li>Protect minors</li>
                </ul>
                
                <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '24px' }}>💯 Be Honest</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '30px', color: '#cbd5e1' }}>
                  <li>No impersonation</li>
                  <li>No misleading content</li>
                  <li>Disclose sponsorships</li>
                  <li>No manipulation</li>
                </ul>
                
                <h3 style={{ color: '#ef4444', marginBottom: '15px', fontSize: '24px' }}>⚠️ Consequences</h3>
                <ul style={{ marginLeft: '20px', marginBottom: '20px', color: '#f87171' }}>
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