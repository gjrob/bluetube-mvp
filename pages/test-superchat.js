// pages/test-superchat.js
// CREATE THIS PAGE TO TEST IMMEDIATELY!
// Access at: http://localhost:3000/test-superchat

import { useState } from 'react';

export default function TestSuperChat() {
  const [amount, setAmount] = useState(25);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testSuperChat = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/super-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          message: message || `Test SuperChat $${amount}!`,
          streamId: 'test-stream',
          pilotId: 'test-pilot'
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // In production, you'd process payment here
        // For now, just show success
        alert(`✅ SuperChat created! Check Stripe Dashboard for payment intent.`);
      }
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-superchat', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        alert('✅ Database test successful! Check your transactions table.');
      }
    } catch (error) {
      setResult({ error: error.message });
    }
  };
// Add to your test page to complete payment:
async function handleStripePayment(clientSecret) {
  const stripe = Stripe('pk_test_YOUR_KEY');
  await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: { /* test card: 4242 4242 4242 4242 */ }
    }
  });
}
// Usage example (call this function when you want to confirm payment):
// handleStripePayment(result.clientSecret);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🚁 SuperChat Test Page
        </h1>
        
        {/* Quick Status Check */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Quick Status Check</h2>
          <div className="space-y-2">
            <button
              onClick={testDatabase}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all"
            >
              Test Database Connection
            </button>
            <button
              onClick={() => window.open('https://dashboard.stripe.com/test/payments', '_blank')}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all"
            >
              Open Stripe Dashboard
            </button>
          </div>
        </div>

        {/* SuperChat Test */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">💰 Test SuperChat</h2>
          
          {/* Amount Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="flex gap-2 mb-2">
              {[5, 25, 50, 100, 500].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    amount === value 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-700 px-3 py-2 rounded-lg"
              min="5"
              max="10000"
            />
          </div>
          
          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional message..."
              className="w-full bg-gray-700 px-3 py-2 rounded-lg"
            />
          </div>
          
          {/* Send Button */}
          <button
            onClick={testSuperChat}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Send Test SuperChat ($${amount})`}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`rounded-xl p-6 ${
            result.success ? 'bg-green-900' : 'bg-red-900'
          }`}>
            <h3 className="font-bold mb-2">
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.clientSecret && (
              <div className="mt-4 p-3 bg-black bg-opacity-30 rounded-lg">
                <p className="text-sm">✅ Payment Intent Created!</p>
                <p className="text-xs text-gray-400 mt-1">
                  Client Secret: {result.clientSecret.substring(0, 30)}...
                </p>
                <p className="text-xs text-gray-400">
                  Check Stripe Dashboard for payment intent
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-xl p-6 mt-6">
          <h3 className="font-bold mb-3">📝 Next Steps:</h3>
          <ol className="space-y-2 text-sm">
            <li>1. Click "Test Database" - Should show success ✅</li>
            <li>2. Click "Send Test SuperChat" - Should create payment intent ✅</li>
            <li>3. Check Stripe Dashboard - Should see pending payment ✅</li>
            <li>4. Check Supabase - Should see transaction in table ✅</li>
            <li>5. If all work, add to your /live page!</li>
          </ol>
        </div>

        {/* Revenue Calculator */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6 mt-6">
          <h3 className="font-bold mb-3">💰 Your Revenue Potential:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold">${amount * 10}</div>
              <div className="text-xs text-gray-300">From 10 SuperChats</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${amount * 100}</div>
              <div className="text-xs text-gray-300">From 100 SuperChats</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${amount * 100 * 30}</div>
              <div className="text-xs text-gray-300">Monthly (100/day)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">${amount * 100 * 30 * 0.7}</div>
              <div className="text-xs text-gray-300">Your 70% Cut</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}