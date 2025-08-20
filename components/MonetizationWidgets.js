// ============================================
// MONETIZATION WIDGETS FOR BLUETUBETV
// Add these to start earning immediately!
// ============================================

// 1. CREATE NEW FILE: components/MonetizationWidgets.js
import { useState, useEffect } from 'react';

export default function MonetizationWidgets() {
  const [showTipModal, setShowTipModal] = useState(false);
  
  useEffect(() => {
    // Load Buy Me a Coffee widget
    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'buymeacoffee.com/garlanjrobinson'); // Change this to your BMC username
    script.setAttribute('data-description', 'Support BlueTubeTV!');
    script.setAttribute('data-message', 'Love our drone content? Buy us a coffee!');
    script.setAttribute('data-color', '#0080FF');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <>
      {/* Floating Tip Button */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowTipModal(true)}
          style={{
            padding: '15px 25px',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          💰 Send Tip
        </button>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#0080FF' }}>
              💙 Support BlueTubeTV
            </h2>
            
            {/* Quick Tip Amounts */}
            <div style={{ marginBottom: '25px' }}>
              <h3>Quick Tip</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[5, 10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => {
                      // PayPal donation link
                      window.open(
                        `https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID&amount=${amount}`,
                        '_blank'
                      );
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#0080FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginBottom: '20px' }}>
              <h3>Payment Methods</h3>
              
              {/* PayPal Button */}
              <form 
                action="https://www.paypal.com/donate?hosted_button_id=PYDSZSVA5HGFJ" 
                method="post" 
                target="_blank"
                style={{ marginBottom: '15px' }}
              >
                <input type="hidden" name="business" value="garlanrobinson@icloud.com" />
                <input type="hidden" name="no_recurring" value="0" />
                <input type="hidden" name="currency_code" value="USD" />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#FFC439',
                    color: '#003087',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <img 
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png" 
                    alt="PayPal" 
                    style={{ height: '20px' }}
                  />
                  Donate with PayPal
                </button>
              </form>

              {/* Venmo */}
              <button
                onClick={() => window.open('https://venmo.com/u/@Garlan-Robinson', '_blank')}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#3D95CE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                Send via Venmo @Garlan-Robinson
              </button>

              {/* Cash App */}
              <button
                onClick={() => window.open('https://cash.app/$GarlanRobinson9', '_blank')}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: '#00D632',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Send via Cash App $GarlanRobinson9
              </button>
            </div>

            {/* Crypto Option */}
            <details style={{ marginBottom: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                🪙 Cryptocurrency
              </summary>
              <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                <p><strong>Bitcoin:</strong> bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                <p><strong>Ethereum:</strong> 0x1234...5678</p>
              </div>
            </details>

            {/* Close Button */}
            <button
              onClick={() => setShowTipModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// 2. ADD TO YOUR _app.js or Layout Component
// ============================================

// In pages/_app.js, add this import at the top:
// import MonetizationWidgets from '../components/MonetizationWidgets';

// Then add the component before closing the main div:
// function MyApp({ Component, pageProps }) {
//   return (
//     <>
//       <Component {...pageProps} />
//       <MonetizationWidgets />
//     </>
//   );
// }

// ============================================
// 3. SUPER CHAT COMPONENT FOR LIVE STREAMS
// ============================================

// CREATE: components/SuperChat.js
export function SuperChat({ streamId }) {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(5);
  
  const sendSuperChat = async () => {
    if (!message || amount < 1) return;
    
    // Animate the super chat
    const chatElement = document.createElement('div');
    chatElement.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        animation: slideIn 0.5s;
        z-index: 9999;
        max-width: 300px;
      ">
        <strong>💰 $${amount} Super Chat!</strong>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(chatElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
      document.body.removeChild(chatElement);
    }, 5000);
    
    // Reset form
    setMessage('');
    setAmount(5);
    
    // In production, save to database
    console.log('Super Chat sent:', { amount, message, streamId });
  };
  
  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      color: 'white'
    }}>
      <h3>💬 Send Super Chat</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {[5, 10, 20, 50, 100].map(value => (
          <button
            key={value}
            onClick={() => setAmount(value)}
            style={{
              padding: '8px 16px',
              background: amount === value ? '#FFD700' : 'rgba(255, 255, 255, 0.2)',
              color: amount === value ? '#333' : 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ${value}
          </button>
        ))}
      </div>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          marginBottom: '10px',
          minHeight: '60px'
        }}
      />
      
      <button
        onClick={sendSuperChat}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Send ${amount} Super Chat
      </button>
    </div>
  );
}

// ============================================
// 4. QUICK SETUP INSTRUCTIONS
// ============================================

const setupInstructions = `
HOW TO ADD WIDGETS TO YOUR SITE:

1. BUY ME A COFFEE (5 minutes):
   - Go to buymeacoffee.com/garlanjrobinson
   - Sign up for free
   - Your username will be your page URL
   - Replace 'bluetubetv' in the code with your username
   - The widget will appear automatically!

2. PAYPAL (10 minutes):
   - Go to https://www.paypal.com/donate/?hosted_button_id=PYDSZSVA5HGFJ
   - Create a donation button
   - Get your hosted_button_id
   - Replace 'YOUR_BUTTON_ID' in the code
   - Or use: your-paypal@email.com for direct donations

3. VENMO (2 minutes):
   - Just replace 'YourVenmoUsername' with your Venmo username
   - That's it!

4. CASH APP (2 minutes):
   - Replace 'YourCashTag' with your $cashtag

5. ADD TO YOUR SITE:
   - Copy MonetizationWidgets.js to your components folder
   - Import it in your _app.js or dashboard.js
   - Deploy to Vercel

YOU'LL START RECEIVING TIPS IMMEDIATELY! 💰
`;

console.log(setupInstructions);

// ============================================
// 5. STYLE ADDITIONS FOR ANIMATIONS
// ============================================

// Add to your global CSS or styled-jsx:
const animationStyles = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.tip-button:hover {
  animation: pulse 0.5s infinite;
}
`;