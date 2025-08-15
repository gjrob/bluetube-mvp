// pages/delivery/[jobId].js - Media Delivery Portal
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Layout from '../../components/Layout'

export default function DeliveryPortal() {
  const router = useRouter()
  const { jobId } = router.query
  const [job, setJob] = useState(null)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [deliveryMethod, setDeliveryMethod] = useState('portal')
  const [downloadProgress, setDownloadProgress] = useState({})

  useEffect(() => {
    if (jobId) {
      loadJobAndFiles()
    }
  }, [jobId])

  const loadJobAndFiles = async () => {
    // Get job details
    const { data: jobData } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()
    
    setJob(jobData)

    // Get uploaded files
    const { data: filesData } = await supabase
      .from('job_deliveries')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    setFiles(filesData || [])
  }

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files)
    setUploading(true)

    for (const file of uploadedFiles) {
      try {
        // Upload to Supabase Storage
        const fileName = `${jobId}/${Date.now()}_${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-deliveries')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('job-deliveries')
          .getPublicUrl(fileName)

        // Save to database
        const { error: dbError } = await supabase
          .from('job_deliveries')
          .insert({
            job_id: jobId,
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            file_type: file.type,
            delivery_method: deliveryMethod,
            status: 'uploaded'
          })

        if (dbError) throw dbError

      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    setUploading(false)
    loadJobAndFiles() // Refresh files list
  }

  const handleBulkDownload = async () => {
    // Create zip file of all deliverables
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (const file of selectedFiles) {
      setDownloadProgress(prev => ({ ...prev, [file.id]: 0 }))
      
      try {
        const response = await fetch(file.file_url)
        const blob = await response.blob()
        zip.file(file.file_name, blob)
        
        setDownloadProgress(prev => ({ ...prev, [file.id]: 100 }))
      } catch (error) {
        console.error('Download error:', error)
      }
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = `job_${jobId}_deliverables.zip`
    a.click()
  }

  const handleCloudDelivery = async (provider) => {
    // Integration with cloud services
    const cloudAPIs = {
      dropbox: '/api/delivery/dropbox',
      gdrive: '/api/delivery/google-drive',
      wetransfer: '/api/delivery/wetransfer'
    }

    const response = await fetch(cloudAPIs[provider], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        files: selectedFiles,
        clientEmail: job?.client_email
      })
    })

    const data = await response.json()
    alert(`Files sent via ${provider}! Link: ${data.shareLink}`)
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
            📦 Delivery Portal
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px' }}>
            Job: {job?.title} | Client: {job?.client_name}
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
            <div>
              <p style={{ color: '#94A3B8', marginBottom: '5px' }}>Total Files</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{files.length}</p>
            </div>
            <div>
              <p style={{ color: '#94A3B8', marginBottom: '5px' }}>Total Size</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {(files.reduce((sum, f) => sum + f.file_size, 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div>
              <p style={{ color: '#94A3B8', marginBottom: '5px' }}>Delivery Status</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                Ready for Download
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section (for pilots) */}
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Upload Deliverables</h2>
          
          {/* Delivery Method Selection */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px' }}>Select Delivery Method:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['portal', 'dropbox', 'gdrive', 'wetransfer', 'direct'].map(method => (
                <button
                  key={method}
                  onClick={() => setDeliveryMethod(method)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: deliveryMethod === method ? '#3B82F6' : '#0F172A',
                    color: 'white',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {method === 'gdrive' ? 'Google Drive' : method}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div style={{
            border: '2px dashed #334155',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#0F172A'
          }}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
              accept="image/*,video/*,.raw,.dng"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📤</div>
              <p style={{ fontSize: '20px', marginBottom: '10px' }}>
                {uploading ? 'Uploading...' : 'Click to upload files'}
              </p>
              <p style={{ color: '#94A3B8' }}>
                Supports: Photos, Videos, RAW files (up to 5GB each)
              </p>
            </label>
          </div>

          {/* Quick Upload Options */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button style={{
              padding: '12px',
              backgroundColor: '#10B981',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              📷 Upload from Camera
            </button>
            <button style={{
              padding: '12px',
              backgroundColor: '#8B5CF6',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              ☁️ Import from Cloud
            </button>
            <button style={{
              padding: '12px',
              backgroundColor: '#F59E0B',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              🔗 Add External Link
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div style={{
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '30px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Deliverables ({files.length})</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedFiles(files)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Select All
              </button>
              <button
                onClick={handleBulkDownload}
                disabled={selectedFiles.length === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: selectedFiles.length === 0 ? 0.5 : 1
                }}
              >
                Download Selected ({selectedFiles.length})
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {files.map(file => (
              <FileCard
                key={file.id}
                file={file}
                selected={selectedFiles.includes(file)}
                onSelect={() => {
                  setSelectedFiles(prev =>
                    prev.includes(file)
                      ? prev.filter(f => f.id !== file.id)
                      : [...prev, file]
                  )
                }}
                downloadProgress={downloadProgress[file.id]}
              />
            ))}
          </div>

          {/* Delivery Options */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#0F172A',
            borderRadius: '12px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Quick Delivery Options</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleCloudDelivery('dropbox')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0061FE',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Send to Dropbox
              </button>
              <button
                onClick={() => handleCloudDelivery('gdrive')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Send to Google Drive
              </button>
              <button
                onClick={() => handleCloudDelivery('wetransfer')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#409FFF',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Send via WeTransfer
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Generate Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// File Card Component
function FileCard({ file, selected, onSelect, downloadProgress }) {
  const isImage = file.file_type?.startsWith('image/')
  const isVideo = file.file_type?.startsWith('video/')
  
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: selected ? '#3B82F6' : '#0F172A',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s'
      }}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px'
        }}
      />

      {/* Preview */}
      <div style={{
        width: '100%',
        height: '150px',
        backgroundColor: '#1E293B',
        borderRadius: '6px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {isImage ? (
          <img src={file.file_url} alt={file.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : isVideo ? (
          <video src={file.file_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ fontSize: '48px' }}>📄</div>
        )}
      </div>

      {/* File Info */}
      <p style={{ fontSize: '14px', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {file.file_name}
      </p>
      <p style={{ fontSize: '12px', color: '#94A3B8' }}>
        {(file.file_size / 1024 / 1024).toFixed(2)} MB
      </p>

      {/* Download Progress */}
      {downloadProgress !== undefined && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: '#1E293B'
        }}>
          <div style={{
            width: `${downloadProgress}%`,
            height: '100%',
            backgroundColor: '#10B981',
            transition: 'width 0.3s'
          }} />
        </div>
      )}
    </div>
  )
}