// pages/pilot/earnings.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/useAuth'

export default function PilotEarnings() {
  const { user, userType } = useAuth()
  const router = useRouter()
  const [earnings, setEarnings] = useState({
    available: 0,
    pending: 0,
    total: 0
  })
  const [transactions, setTransactions] = useState([])
  const [bankAccount, setBankAccount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userType !== 'pilot') {
      router.push('/dashboard')
      return
    }
    fetchEarnings()
    fetchBankAccount()
  }, [user])

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/pilot/earnings')
      const data = await response.json()
      setEarnings(data.earnings)
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error fetching earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBankAccount = async () => {
    try {
      const response = await fetch('/api/pilot/bank-account')
      const data = await response.json()
      setBankAccount(data.bankAccount)
    } catch (error) {
      console.error('Error fetching bank account:', error)
    }
  }

  const handlePayout = async () => {
    if (!bankAccount) {
      alert('Please connect a bank account first')
      return
    }

    if (earnings.available < 50) {
      alert('Minimum payout amount is $50')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/pilot/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: earnings.available
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Payout requested! Funds will arrive in 2-3 business days.')
        fetchEarnings()
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Failed to request payout')
    } finally {
      setLoading(false)
    }
  }

  const connectStripeAccount = async () => {
    try {
      const response = await fetch('/api/pilot/create-connect-account', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      alert('Failed to create Stripe account')
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', color: 'white' }}>Loading...</div>
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          marginBottom: '40px'
        }}>
          Earnings Dashboard
        </h1>

        {/* Earnings Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            padding: '24px',
            borderRadius: '12px',
            border: '2px solid #10B981'
          }}>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '8px' }}>
              Available for Payout
            </h3>
            <p style={{ color: '#10B981', fontSize: '36px', fontWeight: '700' }}>
              ${earnings.available.toFixed(2)}
            </p>
          </div>

          <div style={{
            backgroundColor: '#1E293B',
            padding: '24px',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '8px' }}>
              Pending Clearance
            </h3>
            <p style={{ color: '#F59E0B', fontSize: '36px', fontWeight: '700' }}>
              ${earnings.pending.toFixed(2)}
            </p>
            <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '8px' }}>
              Clears after job completion + 48 hours
            </p>
          </div>

          <div style={{
            backgroundColor: '#1E293B',
            padding: '24px',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '8px' }}>
              Total Earned
            </h3>
            <p style={{ color: '#3B82F6', fontSize: '36px', fontWeight: '700' }}>
              ${earnings.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payout Section */}
        <div style={{
          backgroundColor: '#1E293B',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '24px' }}>
            Payout Settings
          </h2>

          {bankAccount ? (
            <div>
              <div style={{
                backgroundColor: '#0F172A',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#94A3B8', marginBottom: '8px' }}>Bank Account</p>
                <p style={{ color: 'white', fontSize: '18px' }}>
                  {bankAccount.bank_name} •••• {bankAccount.last4}
                </p>
                <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
                  {bankAccount.account_holder_name}
                </p>
              </div>

              <button
                onClick={handlePayout}
                disabled={earnings.available < 50 || loading}
                style={{
                  backgroundColor: earnings.available >= 50 ? '#10B981' : '#374151',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: earnings.available >= 50 ? 'pointer' : 'not-allowed',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Processing...' : `Request Payout ($${earnings.available.toFixed(2)})`}
              </button>

              {earnings.available < 50 && (
                <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '12px' }}>
                  Minimum payout amount is $50
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#94A3B8', marginBottom: '16px' }}>
                Connect your bank account to receive payouts
              </p>
              <button
                onClick={connectStripeAccount}
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Connect Bank Account with Stripe
              </button>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div style={{
          backgroundColor: '#1E293B',
          padding: '32px',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '24px' }}>
            Transaction History
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #374151' }}>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'left' }}>Job</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'left' }}>Type</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'right' }}>Gross</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'right' }}>Fee</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'right' }}>Net</th>
                  <th style={{ color: '#94A3B8', padding: '12px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #374151' }}>
                    <td style={{ color: 'white', padding: '16px' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ color: 'white', padding: '16px' }}>
                      {tx.job_title}
                    </td>
                    <td style={{ color: 'white', padding: '16px' }}>
                      {tx.type === 'job_payment' ? 'Job Payment' : 'Payout'}
                    </td>
                    <td style={{ color: 'white', padding: '16px', textAlign: 'right' }}>
                      ${tx.gross_amount?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ color: '#EF4444', padding: '16px', textAlign: 'right' }}>
                      -${tx.platform_fee?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ 
                      color: tx.amount > 0 ? '#10B981' : '#EF4444', 
                      padding: '16px', 
                      textAlign: 'right',
                      fontWeight: '600'
                    }}>
                      ${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 
                          tx.status === 'completed' ? '#065F46' :
                          tx.status === 'pending' ? '#7C2D12' : '#374151',
                        color: 
                          tx.status === 'completed' ? '#10B981' :
                          tx.status === 'pending' ? '#F59E0B' : '#94A3B8'
                      }}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}