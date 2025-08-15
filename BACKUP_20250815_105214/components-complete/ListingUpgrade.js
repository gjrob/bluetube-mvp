// components/ListingUpgrade.js
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const ListingUpgrade = ({ currentTier, userId }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (tierId) => {
    setLoading(true);
    
    const response = await fetch('/api/subscriptions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, tierId })
    });
    
    const { sessionId } = await response.json();
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId });
  };

  const cardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    margin: '0 8px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    marginTop: '16px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    fontSize: '14px',
    fontWeight: '600'
  };

  const containerStyle = {
    display: 'flex',
    gap: '16px',
    maxWidth: '900px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      {[
        { name: 'Basic', price: 35, listings: 10, color: '#10b981' },
        { name: 'Pro', price: 75, listings: 50, color: '#3b82f6' },
        { name: 'Premium', price: 150, listings: 'Unlimited', color: '#8b5cf6' }
      ].map((tier, i) => (
        <div key={i} style={{...cardStyle, borderColor: tier.color}}>
          <h3 style={{fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0'}}>
            {tier.name}
          </h3>
          <p style={{fontSize: '32px', fontWeight: 'bold', color: tier.color, margin: '8px 0'}}>
            ${tier.price}/mo
          </p>
          <p style={{color: '#6b7280', margin: '8px 0'}}>
            {tier.listings} listings
          </p>
          <button 
            onClick={() => handleUpgrade(i + 1)}
            disabled={loading}
            style={{...buttonStyle, backgroundColor: tier.color}}
          >
            {loading ? 'Processing...' : 'Upgrade'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListingUpgrade;