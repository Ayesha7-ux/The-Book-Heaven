'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BookOpen, Bookmark, Star, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './book.module.css';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`/api/books/${id}`);
        setBook(data.book);
      } catch (error) {
        console.error('Error fetching book', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="container">Loading book details...</div>;
  if (!book) return <div className="container">Book not found.</div>;

  const canRead = !book.isPremium || (user && user.isPremium) || (user && user.role === 'admin');

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.bookLayout}>
        <div className={styles.coverWrapper}>
          <img src={book.coverImage} alt={book.title} className={styles.cover} />
        </div>

        <div className={styles.infoWrapper}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Category</span>
              <span className={styles.metaValue}>{book.category}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Rating</span>
              <span className={styles.metaValue}>
                <Star size={16} inline fill="currentColor" style={{ color: '#f59e0b', marginRight: '4px' }} />
                {book.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Views</span>
              <span className={styles.metaValue}>{book.views}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Type</span>
              <span className={styles.metaValue}>
                {book.isPremium ? (
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={14} /> Premium
                  </span>
                ) : (
                  <span style={{ color: '#22c55e' }}>Free</span>
                )}
              </span>
            </div>
          </div>

          <div className={styles.description}>
            <p>{book.description}</p>
          </div>

          {canRead ? (
            <div className={styles.actions}>
              <button 
                onClick={() => router.push(`/book/${id}/read`)}
                className={styles.readBtn}
              >
                <BookOpen size={20} />
                Read Now
              </button>
              <button className={styles.saveBtn} aria-label="Save Book">
                <Bookmark size={20} />
              </button>
            </div>
          ) : (
            <div className={styles.premiumLock}>
              <Lock size={40} color="var(--accent)" />
              <h3 className={styles.lockTitle}>Premium Content</h3>
              <p className={styles.lockDesc}>
                This book is exclusive to our premium members. Upgrade your account to gain instant access to our entire premium library.
              </p>
              <button 
                onClick={() => router.push('/premium')}
                className={styles.upgradeBtn}
              >
                Go Premium
              </button>
            </div>
          )}

          {user && user.role === 'admin' && (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--accent)', borderRadius: 'var(--radius)' }}>
              <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> Admin Access Granted
              </p>
              <button 
                onClick={() => router.push(`/admin/edit/${id}`)}
                style={{ marginTop: '0.5rem', color: 'var(--accent)', fontWeight: '600' }}
              >
                Edit Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
