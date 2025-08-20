import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Upload() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '0',
    category: 'freestyle',
    visibility: 'public',
    tags: '',
    pilotId: '' // TEMP: let the pilot paste their UUID; wire real auth later
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);

  // ------- drag & drop ----------
  function handleDrag(e) {
    e.preventDefault(); e.stopPropagation();
  }
  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) setSelectedFile(f);
  }

  // ------- input helpers ----------
  function onChangeField(e) {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  }
  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  }

  // ------- submit ----------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedFile) { setStatus('Choose a video file.'); return; }
    if (!formData.title) { setStatus('Add a title.'); return; }
    if (!formData.pilotId) {
      setStatus('Enter Pilot ID (UUID) for now. We’ll auto-fill from login later.');
      return;
    }
    setUploading(true);
    setStatus('Uploading…');

    // Build multipart form data
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('price', formData.price || '0');
    fd.append('category', formData.category || 'freestyle');
    fd.append('tags', formData.tags || '');
    fd.append('pilotId', formData.pilotId);         // server expects this for now
    fd.append('video', selectedFile, selectedFile.name);

    // Use XMLHttpRequest so we can show real upload progress
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload-video');

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        setUploadProgress(pct);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setStatus('Network error while uploading.');
    };

    xhr.onload = () => {
      setUploading(false);
      try {
        const json = JSON.parse(xhr.responseText || '{}');
        if (!json.success) {
          setStatus(json.error || 'Upload failed.');
          return;
        }
        setStatus('🎉 Video uploaded!');
        const id = json?.video?.id;
        // If your backend returns the new video id, go straight to the watch page
        if (id) {
          router.push(`/watch/${id}`);
        } else {
          router.push('/marketplace');
        }
      } catch (e) {
        setStatus('Unexpected response from server.');
      }
    };

    xhr.send(fd);
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Upload a Video</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Share your flight. After upload we’ll give you a public link to send to friends.
      </p>

      {/* Basic fields */}
      <label>Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={onChangeField}
        placeholder="Milky Way flyover"
        style={{ width: '100%', margin: '6px 0 16px 0' }}
      />

      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChangeField}
        placeholder="What viewers will see…"
        rows={3}
        style={{ width: '100%', margin: '6px 0 16px 0' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label>Price (USD)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            value={formData.price}
            onChange={onChangeField}
            style={{ width: '100%', marginTop: 6 }}
          />
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChangeField}
            style={{ width: '100%', marginTop: 6 }}
          >
            <option value="freestyle">Freestyle</option>
            <option value="scenic">Scenic</option>
            <option value="real-estate">Real Estate</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
      </div>

      <label style={{ marginTop: 16 }}>Tags (comma separated)</label>
      <input
        name="tags"
        value={formData.tags}
        onChange={onChangeField}
        placeholder="sunset, city, river"
        style={{ width: '100%', margin: '6px 0 16px 0' }}
      />

      {/* TEMP: Pilot ID until we wire auth */}
      <label>Pilot ID (UUID)</label>
      <input
        name="pilotId"
        value={formData.pilotId}
        onChange={onChangeField}
        placeholder="00000000-0000-0000-0000-000000000000"
        style={{ width: '100%', margin: '6px 0 16px 0' }}
      />

      {/* Drag & drop */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #888',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          margin: '12px 0 8px',
          cursor: 'pointer'
        }}
      >
        {selectedFile
          ? <div>Selected: <b>{selectedFile.name}</b></div>
          : <div>Drag a video here, or click to choose file</div>}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={onPickFile}
          style={{ display: 'none' }}
        />
      </div>

      {/* Agree to terms */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <span>
          I own this content and accept the{' '}
          <Link href="/legal" style={{ textDecoration: 'underline' }}>terms</Link>.
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!agreedToTerms || uploading || !selectedFile}
        style={{
          padding: '10px 16px',
          borderRadius: 10,
          border: 'none',
          background: (!agreedToTerms || uploading || !selectedFile) ? '#aaa' : '#4f46e5',
          color: 'white',
          cursor: (!agreedToTerms || uploading || !selectedFile) ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading…' : 'Upload'}
      </button>

      {/* Progress + status */}
      {uploading && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 8, background: '#eee', borderRadius: 6 }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: 8,
              background: '#4f46e5',
              borderRadius: 6,
              transition: 'width 0.2s ease'
            }} />
          </div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
            {uploadProgress}% — don’t close this tab.
          </div>
        </div>
      )}
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
