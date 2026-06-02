'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
import styles from '../admin.module.css';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Self-help', 'Education', 'Academic', 'Literature'];

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Fiction',
    isPremium: false,
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const router = useRouter();

  const handleUpload = async (file: File, folder: string) => {
    const { data: sigData } = await axios.post('/api/admin/cloudinary-sig', { folder });
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', sigData.apiKey);
    uploadData.append('timestamp', sigData.timestamp);
    uploadData.append('signature', sigData.signature);
    uploadData.append('folder', folder);

    const { data: cloudinaryRes } = await axios.post(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
      uploadData
    );

    return cloudinaryRes.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !pdfFile) {
      alert('Please select both cover image and PDF file');
      return;
    }

    setLoading(true);
    setStatus('Uploading assets to Cloudinary...');

    try {
      const coverUrl = await handleUpload(coverFile, 'book-covers');
      setStatus('Cover uploaded. Uploading PDF...');
      const pdfUrl = await handleUpload(pdfFile, 'book-pdfs');

      setStatus('Finalizing book entry...');
      await axios.post('/api/books', {
        ...formData,
        coverImage: coverUrl,
        pdfUrl: pdfUrl,
      });

      setStatus('Book added successfully!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (error: any) {
      console.error(error);
      alert('Failed to add book: ' + (error.response?.data?.message || error.message));
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} className={styles.statCard}>
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--serif-font)' }}>Add New Book</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Book Title</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Author Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>
        </div>

        <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="checkbox"
              id="isPremium"
              checked={formData.isPremium}
              onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="isPremium" style={{ fontWeight: '600' }}>Premium Content</label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="cover-upload"
            />
            <label htmlFor="cover-upload" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius)', cursor: 'pointer', justifyContent: 'center' 
            }}>
              {coverFile ? <CheckCircle size={20} color="#22c55e" /> : <Upload size={20} />}
              {coverFile ? coverFile.name : 'Upload Cover'}
            </label>
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>PDF Document</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius)', cursor: 'pointer', justifyContent: 'center' 
            }}>
              {pdfFile ? <CheckCircle size={20} color="#22c55e" /> : <Upload size={20} />}
              {pdfFile ? pdfFile.name : 'Upload PDF'}
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', marginTop: '2rem', padding: '1rem', background: 'var(--primary)', 
            color: 'var(--primary-foreground)', borderRadius: 'var(--radius)', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
          }}
        >
          {loading ? <><Loader2 className="animate-spin" size={20} /> {status}</> : 'Publish Book'}
        </button>
      </form>
    </div>
  );
}
