'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Book as BookIcon, Eye, Star, Trash2, Edit } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    premium: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data/books.json');
        const json = await res.json();
        const seedBooks = json.books || [];
        const localRaw = localStorage.getItem('mock_books');
        const localBooks = localRaw ? JSON.parse(localRaw) : [];
        const merged = [...localBooks, ...seedBooks];
        setBooks(merged);
        
        const freeCount = json.books.filter((b: any) => !b.isPremium).length;
        const premiumCount = json.books.filter((b: any) => b.isPremium).length;
        const viewsCount = json.books.reduce((acc: number, b: any) => acc + (b.views || 0), 0);

        setStats({
          total: json.books.length,
          free: freeCount,
          premium: premiumCount,
          totalViews: viewsCount
        });
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updated = books.filter((b: any) => b._id !== id);
      setBooks(updated);
      // persist deletions locally for demo
      const seedRes = fetch('/data/books.json').then(r => r.json()).then(j => j.books || []);
      Promise.resolve(seedRes).then((seedBooks: any[]) => {
        // keep only local-created books in mock_books
        const remainingLocal = updated.filter(b => !seedBooks.find(sb => sb._id === b._id));
        localStorage.setItem('mock_books', JSON.stringify(remainingLocal));
      });
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Books</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Free vs Premium</span>
          <span className={styles.statValue}>{stats.free} / {stats.premium}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Views</span>
          <span className={styles.statValue}>{stats.totalViews}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Quick Actions</span>
          <Link href="/admin/add-book" className={styles.addBtn}>
            <Plus size={18} /> Add New Book
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Book</th>
              <th>Category</th>
              <th>Type</th>
              <th>Stats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: any) => (
              <tr key={book._id}>
                <td>
                  <div className={styles.bookInfo}>
                    <img src={book.coverImage} alt="" className={styles.smallCover} />
                    <div>
                      <div className={styles.bookTitle}>{book.title}</div>
                      <div className={styles.bookAuthor}>{book.author}</div>
                    </div>
                  </div>
                </td>
                <td>{book.category}</td>
                <td>
                  <span className={book.isPremium ? styles.typePremium : styles.typeFree}>
                    {book.isPremium ? 'Premium' : 'Free'}
                  </span>
                </td>
                <td>
                  <div className={styles.bookStats}>
                    <span title="Views"><Eye size={14} /> {book.views}</span>
                    <span title="Rating"><Star size={14} /> {book.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/edit/${book._id}`} className={styles.editBtn} aria-label="Edit">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(book._id)} className={styles.deleteBtn} aria-label="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
