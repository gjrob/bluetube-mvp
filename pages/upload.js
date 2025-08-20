import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '0',
    category: 'freestyle',
    visibility: 'public',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            alert('🎉 Video uploaded successfully!');
            router.push('/marketplace');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0B1929 0%, #1e3c72 50%, #2a5298 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        background: `
          radial-gradient(circle at 20% 50%, #00d4ff 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #0099ff 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, #00ffff 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }}/>

      {/* Navigation */}
      <nav style={{ 
        padding: '25px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <Link href="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '28px', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textShadow: '0 2px 10px rgba(0, 212, 255, 0.5)'
        }}>
          <span style={{ fontSize: '35px' }}>🌊</span> BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/dashboard" style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '10px 20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '25px',
            transition: 'all 0.3s',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div style={{ 
        maxWidth: '900px', 
        margin: '50px auto', 
        padding: '0 20px',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '48px',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #00d4ff, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
          }}>
            Upload Your Flight
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
            Share your drone footage with the world 🚁
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            {/* Left Column */}
            <div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e3c72',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Epic Mountain Flight"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px', 
                    border: '2px solid #e0e7ff',
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    background: 'white',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e7ff'}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e3c72',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px', 
                    border: '2px solid #e0e7ff',
                    fontSize: '16px',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="freestyle">🎮 Freestyle</option>
                  <option value="racing">🏁 Racing</option>
                  <option value="cinematic">🎬 Cinematic</option>
                  <option value="tutorial">📚 Tutorial</option>
                  <option value="commercial">💼 Commercial</option>
                  <option value="fpv">🥽 FPV</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e3c72',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Visibility
                </label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {['public', 'unlisted', 'private'].map(vis => (
                    <label key={vis} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: formData.visibility === vis ? '#00d4ff' : '#e0e7ff',
                      background: formData.visibility === vis ? 'rgba(0, 212, 255, 0.1)' : 'white'
                    }}>
                      <input
                        type="radio"
                        value={vis}
                        checked={formData.visibility === vis}
                        onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ textTransform: 'capitalize', color: '#1e3c72' }}>
                        {vis === 'public' ? '🌍 ' : vis === 'unlisted' ? '🔗 ' : '🔒 '}{vis}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e3c72',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Price
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ 
                    position: 'absolute', 
                    left: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#1e3c72',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '14px 14px 14px 35px', 
                      borderRadius: '10px', 
                      border: '2px solid #e0e7ff',
                      fontSize: '16px',
                      background: 'white',
                      outline: 'none'
                    }}
                  />
                  <small style={{ 
                    color: '#666', 
                    marginTop: '5px', 
                    display: 'block' 
                  }}>
                    💡 Set to $0 for free content
                  </small>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#1e3c72',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="drone, fpv, mavic, cinematic"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '10px', 
                    border: '2px solid #e0e7ff',
                    fontSize: '16px',
                    background: 'white',
                    outline: 'none'
                  }}
                />
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  Separate with commas
                </small>
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#1e3c72',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Tell viewers about your flight, equipment used, location..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '10px', 
                border: '2px solid #e0e7ff',
                fontSize: '16px',
                resize: 'vertical',
                background: 'white',
                outline: 'none'
              }}
            />
          </div>

          {/* File Upload Drop Zone */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#1e3c72',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Video File *
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{ 
                border: `3px dashed ${dragActive ? '#00d4ff' : '#e0e7ff'}`,
                borderRadius: '15px',
                padding: '40px',
                textAlign: 'center',
                background: dragActive ? 'rgba(0, 212, 255, 0.05)' : 'rgba(240, 248, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <input
                type="file"
                accept="video/*"
                required={!selectedFile}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                  {selectedFile ? '🎬' : '📹'}
                </div>
                {selectedFile ? (
                  <div>
                    <p style={{ color: '#1e3c72', fontWeight: 'bold', fontSize: '18px' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ color: '#666', marginTop: '5px' }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <p style={{ color: '#1e3c72', fontWeight: 'bold', fontSize: '18px' }}>
                      Drop your video here or click to browse
                    </p>
                    <p style={{ color: '#666', marginTop: '10px' }}>
                      MP4, MOV, AVI up to 4GB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: '#e0e7ff', 
                borderRadius: '10px', 
                overflow: 'hidden',
                height: '8px'
              }}>
                <div style={{ 
                  background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
                  height: '100%',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                }}/>
              </div>
              <p style={{ 
                textAlign: 'center', 
                marginTop: '10px',
                color: '#1e3c72',
                fontWeight: 'bold'
              }}>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            style={{
              width: '100%',
              padding: '18px',
              background: uploading 
                ? 'linear-gradient(45deg, #ccc, #999)' 
                : 'linear-gradient(45deg, #00d4ff 0%, #0099ff 50%, #1e3c72 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: uploading ? 'none' : '0 10px 30px rgba(0, 153, 255, 0.3)',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => !uploading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {uploading ? '⏳ Processing Upload...' : '🚀 Launch Video'}
          </button>
        </form>

        {/* Tips Section */}
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>
            💡 Pro Tips for Better Reach
          </h3>
          <ul style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
            <li>Use descriptive titles with keywords pilots search for</li>
            <li>Upload in 4K for best quality (1080p minimum)</li>
            <li>Add location tags to appear in local searches</li>
            <li>Best upload times: 6-9 AM and 7-10 PM EST</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}