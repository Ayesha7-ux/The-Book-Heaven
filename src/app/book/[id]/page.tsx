import { BookOpen, Bookmark, Star, Lock, ShieldCheck } from 'lucide-react';
import styles from './book.module.css';
import path from 'path';
import fs from 'fs';

export const dynamicParams = false;

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'books.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const books = data?.books || [];
  return books.map((b: any) => ({ id: String(b._id) }));
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const filePath = path.join(process.cwd(), 'public', 'data', 'books.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const book = (data.books || []).find((b: any) => String(b._id) === String(id));

  if (!book) return <div className="container">Book not found.</div>;

  const canRead = !book.isPremium;

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
                <Star size={16} fill="currentColor" style={{ color: '#f59e0b', marginRight: '4px' }} />
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
              <a href={`/book/${id}/read`} className={styles.readBtn}>
                <BookOpen size={20} />
                Read Now
              </a>
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
              <a href="/premium" className={styles.upgradeBtn}>
                Go Premium
              </a>
            </div>
          )}

          {book.adminNote && (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--accent)', borderRadius: 'var(--radius)' }}>
              <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> Admin Note
              </p>
              <div style={{ marginTop: '0.5rem', color: 'var(--accent)', fontWeight: '600' }}>
                {book.adminNote}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
