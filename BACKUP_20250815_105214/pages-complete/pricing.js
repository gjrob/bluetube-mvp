import Layout from '../components/Layout';
import Head from 'next/head';
import React, { useState } from 'react';
import { Check, X, Zap, Star, Crown } from 'lucide-react';

const handleCheckout = async (planName) => {
  try {
    // Map plan names to actual price IDs
    const priceIds = {
      'Professional': process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      'Enterprise': process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID
    };
    
    const priceId = priceIds[planName];
    
    if (!priceId) {
      alert('Stripe price ID not found. Check environment variables.');
      return;
    }
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode: 'subscription',
      }),
    });
    
    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Checkout failed. Please try again.');
  }
};

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '40px 20px',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '20px',
    },
    subtitle: {
      fontSize: '24px',
      color: '#94a3b8',
      marginBottom: '40px',
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '60px',
    },
    toggle: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '30px',
      padding: '4px',
      display: 'flex',
      position: 'relative',
    },
    toggleOption: {
      padding: '12px 24px',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '16px',
      fontWeight: '600',
      position: 'relative',
      zIndex: 2,
    },
    toggleActive: {
      color: 'white',
    },
    toggleSlider: {
      position: 'absolute',
      top: '4px',
      left: billingCycle === 'monthly' ? '4px' : '120px',
      width: '110px',
      height: '44px',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      zIndex: 1,
    },
    saveBadge: {
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      marginBottom: '60px',
    },
    pricingCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      position: 'relative',
      transition: 'all 0.3s ease',
    },
    popularCard: {
      border: '2px solid rgba(59, 130, 246, 0.5)',
      transform: 'scale(1.05)',
    },
    popularBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #ef4444, #f97316)',
      padding: '6px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
    },
    planIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    planName: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    planPrice: {
      fontSize: '48px',
      fontWeight: '900',
      marginBottom: '5px',
    },
    planPeriod: {
      color: '#94a3b8',
      fontSize: '16px',
      marginBottom: '30px',
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '30px',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '16px',
      borderRadius: '50px',
      border: 'none',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      color: 'white',
      boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
    },
    secondaryButton: {
      background: 'transparent',
      color: '#60a5fa',
      border: '2px solid rgba(59, 130, 246, 0.5)',
    },
    comparisonSection: {
      marginTop: '80px',
      marginBottom: '60px',
    },
    comparisonCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
    },
    faqSection: {
      marginTop: '80px',
    },
  };

  const pilotPlans = [
    {
      name: 'Hobbyist',
      icon: <Zap size={30} />,
      iconBg: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
      price: billingCycle === 'monthly' ? 'Free' : 'Free',
      features: [
        { text: 'List in pilot directory', included: true },
        { text: 'Apply to 5 jobs/month', included: true },
        { text: 'Basic profile page', included: true },
        { text: 'Live streaming (30 min/day)', included: true },
        { text: 'Standard support', included: true },
        { text: 'Priority job notifications', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Remove platform fees', included: false },
      ],
      cta: 'Start Free',
      ctaStyle: 'secondary',
    },
    {
      name: 'Professional',
      icon: <Star size={30} />,
      iconBg: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      price: billingCycle === 'monthly' ? '$29' : '$290',
      popular: true,
      features: [
        { text: 'Everything in Hobbyist', included: true },
        { text: 'Unlimited job applications', included: true },
        { text: 'Priority in search results', included: true },
        { text: 'Unlimited streaming', included: true },
        { text: 'Advanced portfolio showcase', included: true },
        { text: 'Real-time job alerts', included: true },
        { text: 'Reduced fees (10% → 5%)', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Go Professional',
      ctaStyle: 'primary',
    },
    {
      name: 'Enterprise',
      icon: <Crown size={30} />,
      iconBg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      price: billingCycle === 'monthly' ? '$99' : '$990',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Multiple pilot accounts', included: true },
        { text: 'White-label options', included: true },
        { text: 'API access', included: true },
        { text: 'Custom contracts', included: true },
        { text: 'No platform fees', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations', included: true },
      ],
      cta: 'Go Enterprise',
      ctaStyle: 'secondary',
    },
  ];

  return (
    <>
      <Head>
        <title>Pricing - BlueTubeTV</title>
      </Head>
      <Layout>
        <div style={styles.container}>
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <h1 style={styles.title}>Simple, Transparent Pricing</h1>
              <p style={styles.subtitle}>
                Choose the plan that fits your drone business
              </p>
            </div>

            {/* Billing Toggle */}
            <div style={styles.toggleContainer}>
              <div style={styles.toggle}>
                <div style={styles.toggleSlider} />
                <div
                  style={{
                    ...styles.toggleOption,
                    ...(billingCycle === 'monthly' ? styles.toggleActive : { color: '#94a3b8' })
                  }}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </div>
                <div
                  style={{
                    ...styles.toggleOption,
                    ...(billingCycle === 'yearly' ? styles.toggleActive : { color: '#94a3b8' })
                  }}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                </div>
              </div>
              {billingCycle === 'yearly' && (
                <div style={styles.saveBadge}>
                  Save 20%
                </div>
              )}
            </div>

            {/* Pricing Cards */}
            <div style={styles.pricingGrid}>
              {pilotPlans.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.pricingCard,
                    ...(plan.popular ? styles.popularCard : {})
                  }}
                >
                  {plan.popular && (
                    <div style={styles.popularBadge}>
                      🔥 Most Popular
                    </div>
                  )}
                  
                  <div style={{ ...styles.planIcon, background: plan.iconBg }}>
                    {plan.icon}
                  </div>
                  
                  <h3 style={styles.planName}>{plan.name}</h3>
                  
                  <div style={styles.planPrice}>
                    {plan.price}
                  </div>
                  <div style={styles.planPeriod}>
                    {plan.price !== 'Free' && (billingCycle === 'monthly' ? '/month' : '/year')}
                  </div>
                  
                  <ul style={styles.featureList}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={styles.feature}>
                        {feature.included ? (
                          <Check size={20} color="#10b981" />
                        ) : (
                          <X size={20} color="#6b7280" />
                        )}
                        <span style={{ color: feature.included ? 'white' : '#6b7280' }}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    style={{
                      ...styles.button,
                      ...(plan.ctaStyle === 'primary' ? styles.primaryButton : styles.secondaryButton)
                    }}
                    onClick={() => {
                      if (plan.name === 'Hobbyist') {
                        window.location.href = '/signup';
                      } else if (plan.name === 'Professional') {
                        handleCheckout('Professional');
                      } else if (plan.name === 'Enterprise') {
                        handleCheckout('Enterprise');
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Job Posting Pricing */}
            <div style={styles.comparisonSection}>
              <h2 style={{ ...styles.title, fontSize: '36px', marginBottom: '40px' }}>
                For Clients Posting Jobs
              </h2>
              <div style={styles.comparisonCard}>
                <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>
                  Post Jobs for FREE
                </h3>
                <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '30px' }}>
                  No upfront costs • Pay pilots directly • Unlimited job posts
                </p>
                <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>$0</div>
                    <div style={{ color: '#94a3b8' }}>To post jobs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#60a5fa' }}>2.9%</div>
                    <div style={{ color: '#94a3b8' }}>Transaction fee</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#a78bfa' }}>24/7</div>
                    <div style={{ color: '#94a3b8' }}>Support</div>
                  </div>
                </div>
                <button
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    maxWidth: '300px',
                    margin: '30px auto 0'
                  }}
                  onClick={() => window.location.href = '/jobs/post-job'}
                >
                  Post Your First Job
                </button>
              </div>
            </div>

            {/* Revenue Streams Summary */}
            <div style={styles.comparisonCard}>
              <h3 style={{ fontSize: '28px', marginBottom: '30px' }}>
                💰 How BlueTubeTV Makes Money
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
                textAlign: 'left'
              }}>
                <div>
                  <h4 style={{ color: '#3b82f6', marginBottom: '10px' }}>Pilot Subscriptions</h4>
                  <p style={{ color: '#94a3b8' }}>$29-99/month for premium features</p>
                </div>
                <div>
                  <h4 style={{ color: '#10b981', marginBottom: '10px' }}>Transaction Fees</h4>
                  <p style={{ color: '#94a3b8' }}>2.9% on completed jobs</p>
                </div>
                <div>
                  <h4 style={{ color: '#ef4444', marginBottom: '10px' }}>Live Stream Tips</h4>
                  <p style={{ color: '#94a3b8' }}>10% of SuperChat donations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}