// pages/pilot-setup.js - Inline Styles Version
import { useState } from 'react';
import Layout from '../components/Layout.js';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, Shield, Camera, DollarSign, Users, Star, ChevronRight, Zap } from 'lucide-react';

export default function PilotSetup() {
  const [activeStep, setActiveStep] = useState(0);

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
    benefitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginBottom: '60px',
    },
    benefitCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
    },
    benefitIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    stepSection: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '40px',
    },
    stepHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '40px',
      flexWrap: 'wrap',
      gap: '20px',
    },
    step: {
      flex: 1,
      textAlign: 'center',
      minWidth: '150px',
    },
    stepNumber: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(59, 130, 246, 0.2)',
      border: '2px solid rgba(59, 130, 246, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    stepActive: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '2px solid transparent',
    },
    input: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      marginBottom: '20px',
    },
    button: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
    },
    ctaSection: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '20px',
      padding: '40px',
      textAlign: 'center',
      marginTop: '60px',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    statCard: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#60a5fa',
      marginBottom: '8px',
    },
  };

  const benefits = [
    {
      icon: <DollarSign size={30} />,
      title: 'Earn $150+ Per Job',
      description: 'Set your own rates and keep 85% of earnings',
    },
    {
      icon: <Users size={30} />,
      title: 'Growing Client Base',
      description: 'Access to thousands of customers nationwide',
    },
    {
      icon: <Shield size={30} />,
      title: 'Insurance Coverage',
      description: 'Up to $1M liability coverage included',
    },
    {
      icon: <Camera size={30} />,
      title: 'Live Streaming',
      description: 'Monetize your flights with tips and subscriptions',
    },
    {
      icon: <Star size={30} />,
      title: 'Build Your Brand',
      description: 'Professional profile and portfolio showcase',
    },
    {
      icon: <Zap size={30} />,
      title: 'Instant Payments',
      description: 'Get paid within 24 hours of job completion',
    },
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Personal details' },
    { number: 2, title: 'Certifications', description: 'License & insurance' },
    { number: 3, title: 'Equipment', description: 'Your drone fleet' },
    { number: 4, title: 'Portfolio', description: 'Showcase work' },
  ];

  const stats = [
    { number: '2,847', label: 'Active Pilots' },
    { number: '$150+', label: 'Avg Per Job' },
    { number: '12,500', label: 'Jobs Posted' },
    { number: '98%', label: 'Satisfaction' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Become a BlueTubeTV Pilot</h1>
          <p style={styles.subtitle}>
            Join the largest network of professional drone operators
          </p>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={{ color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              style={styles.benefitCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={styles.benefitIcon}>
                {benefit.icon}
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>
                {benefit.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Registration Steps */}
        <div style={styles.stepSection}>
          <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center' }}>
            Quick Registration Process
          </h2>
          
          {/* Step Indicators */}
          <div style={styles.stepHeader}>
            {steps.map((step, index) => (
              <div key={index} style={styles.step}>
                <div style={{
                  ...styles.stepNumber,
                  ...(activeStep >= index ? styles.stepActive : {})
                }}>
                  {activeStep > index ? <CheckCircle size={20} /> : step.number}
                </div>
                <div style={{ fontWeight: activeStep === index ? 'bold' : 'normal' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {step.description}
                </div>
              </div>
            ))}
          </div>

          {/* Form Content Based on Active Step */}
          <div style={{ marginTop: '40px' }}>
            {activeStep === 0 && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Tell us about yourself</h3>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  style={styles.input}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  style={styles.input}
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  style={styles.input}
                />
                <input 
                  type="text" 
                  placeholder="City, State" 
                  style={styles.input}
                />
              </div>
            )}

            {activeStep === 1 && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Certifications & Insurance</h3>
                <input 
                  type="text" 
                  placeholder="FAA Registration Number" 
                  style={styles.input}
                />
                <input 
                  type="text" 
                  placeholder="Part 107 Certificate Number" 
                  style={styles.input}
                />
                <select style={styles.input}>
                  <option>Insurance Coverage Level</option>
                  <option>$500K Coverage</option>
                  <option>$1M Coverage</option>
                  <option>$2M+ Coverage</option>
                </select>
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Your Equipment</h3>
                <select style={styles.input}>
                  <option>Primary Drone Model</option>
                  <option>DJI Mavic 3 Pro</option>
                  <option>DJI Mini 3 Pro</option>
                  <option>Autel EVO II</option>
                  <option>Other Professional Model</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Years of Flying Experience" 
                  style={styles.input}
                />
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Services You Offer:
                  </label>
                  {['Real Estate', 'Weddings', 'Inspections', 'Mapping', 'Events'].map(service => (
                    <label key={service} style={{ display: 'block', marginBottom: '10px' }}>
                      <input type="checkbox" style={{ marginRight: '10px' }} />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Portfolio & Rates</h3>
                <div style={{
                  ...styles.input,
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderStyle: 'dashed'
                }}>
                  📁 Upload Portfolio Samples (Coming Soon)
                </div>
                <input 
                  type="text" 
                  placeholder="Hourly Rate ($)" 
                  style={styles.input}
                />
                <textarea 
                  placeholder="Brief description of your experience and specialties" 
                  style={{
                    ...styles.input,
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '30px',
              gap: '20px'
            }}>
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  style={{
                    ...styles.button,
                    background: 'transparent',
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    color: '#60a5fa'
                  }}
                >
                  ← Previous
                </button>
              )}
              
              <button
                onClick={() => {
                  if (activeStep < steps.length - 1) {
                    setActiveStep(activeStep + 1);
                  } else {
                    alert('Registration complete! Redirecting to dashboard...');
                    window.location.href = '/dashboard';
                  }
                }}
                style={{
                  ...styles.button,
                  marginLeft: activeStep === 0 ? 'auto' : '0'
                }}
              >
                {activeStep === steps.length - 1 ? 'Complete Registration' : 'Next Step'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
            Ready to Start Earning?
          </h2>
          <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '30px' }}>
            Join 2,847 pilots already flying with BlueTubeTV
          </p>
          <button
            onClick={() => setActiveStep(0)}
            style={{
              ...styles.button,
              fontSize: '20px',
              padding: '20px 40px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
            }}
          >
            Start Registration Now
            <ChevronRight size={24} />
          </button>
          <p style={{ marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
            No fees to join • Start earning immediately • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};