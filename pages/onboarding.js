import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Onboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Choose Role
  const ChooseRole = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
        Welcome! What brings you here?
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        <button
          onClick={() => {
            setRole('pilot');
            setStep(2);
          }}
          style={{
            padding: '24px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚁</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            I want to stream
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Earn money flying drones
          </p>
        </button>
        
        <button
          onClick={() => {
            setRole('client');
            setStep(2);
          }}
          style={{
            padding: '24px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💼</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            I need pilots
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Hire drone operators
          </p>
        </button>
      </div>
    </div>
  );

  // Step 2: Setup Profile
  const SetupProfile = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
        {role === 'pilot' ? 'Set up your pilot profile' : 'Set up your company profile'}
      </h2>
      
      {role === 'pilot' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Pilot name"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <select style={{
            width: '100%',
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            <option>Select your drone</option>
            <option>DJI Mavic 3</option>
            <option>DJI Mini 3 Pro</option>
            <option>Autel EVO II</option>
            <option>Other</option>
          </select>
          <textarea
            placeholder="Tell viewers about yourself"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              minHeight: '128px',
              resize: 'vertical'
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Company name"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            placeholder="Industry"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <textarea
            placeholder="What kind of drone services do you need?"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              minHeight: '128px',
              resize: 'vertical'
            }}
          />
        </div>
      )}
      
      <button
        onClick={() => setStep(3)}
        style={{
          width: '100%',
          background: '#2563eb',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
      >
        Continue
      </button>
    </div>
  );

  // Step 3: Ready to Go
  const ReadyToGo = () => (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ fontSize: '64px' }}>🎉</div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
        You're all set!
      </h2>
      <p style={{ color: '#6b7280' }}>
        {role === 'pilot' 
          ? "You're ready to start streaming and earning"
          : "You're ready to post jobs and find pilots"}
      </p>
      
      <button
        onClick={async () => {
          setLoading(true);
          await supabase.auth.updateUser({
            data: { role, onboarded: true }
          });
          
          if (role === 'pilot') {
            router.push('/live');
          } else {
            router.push('/jobs/post');
          }
        }}
        disabled={loading}
        style={{
          background: '#10b981',
          color: 'white',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1,
          transition: 'background 0.3s'
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#059669')}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#10b981')}
      >
        {loading ? 'Setting up...' : role === 'pilot' ? '🔴 Start Streaming' : '💼 Post First Job'}
      </button>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: i <= step ? '#2563eb' : '#e5e7eb',
                    color: i <= step ? 'white' : '#6b7280'
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
            <div style={{
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div 
                style={{
                  height: '8px',
                  background: '#2563eb',
                  borderRadius: '9999px',
                  transition: 'width 0.3s',
                  width: `${(step / 3) * 100}%`
                }}
              />
            </div>
          </div>
          
          {/* Step content */}
          {step === 1 && <ChooseRole />}
          {step === 2 && <SetupProfile />}
          {step === 3 && <ReadyToGo />}
        </div>
      </div>
    </div>
  );
}
