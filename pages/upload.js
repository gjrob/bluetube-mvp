import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '0',
    category: 'freestyle'
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      alert('Video uploaded successfully! (Demo mode)');
      router.push('/marketplace');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          🚁 BlueTubeTV
        </Link>
        <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Back to Dashboard</Link>
      </nav>

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>📤 Upload Content</h1>
        
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="freestyle">Freestyle</option>
              <option value="racing">Racing</option>
              <option value="cinematic">Cinematic</option>
              <option value="tutorial">Tutorial</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <small style={{ color: '#666' }}>Set to 0 for free content</small>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Video File</label>
            <input
              type="file"
              accept="video/*"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              width: '100%',
              padding: '15px',
              background: uploading ? '#ccc' : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
