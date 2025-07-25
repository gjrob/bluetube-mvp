// At the top of your component (inside the function):
const [agreedToTerms, setAgreedToTerms] = useState(false);

// In your return/render section:
return (
  <div>
    {/* Your existing upload UI */}
    
    {/* Add this checkbox */}
    <div style={{ margin: '20px 0' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <span>I agree that I own this content and accept the terms</span>
      </label>
    </div>
    
    {/* Your upload button */}
    <button 
      disabled={!agreedToTerms}
      onClick={handleUpload}
  style={{
    opacity: agreedToTerms ? 1 : 0.5,
    cursor: agreedToTerms ? 'pointer' : 'not-allowed'
  }}
>
  Upload
</button>
<p style={{ fontSize: '12px', color: '#666' }}>
  By uploading, you agree to our <a href="/legal">terms</a>
</p>
  </div>
);