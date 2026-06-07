'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import BookCard from '@/components/BookCard';
import styles from './page.module.css';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [freeBooks, setFreeBooks] = useState<any[]>([]);
  const [premiumBooks, setPremiumBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        const all = data.books || [];

        setFeaturedBooks(all.slice(0, 4));
        setFreeBooks(all.filter((b: any) => !b.isPremium).slice(0, 4));
        setPremiumBooks(all.filter((b: any) => b.isPremium).slice(0, 4));
      } catch (error) {
        console.error('Error fetching books', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Your Gateway to Heaven of Books</h1>
          <p className={styles.heroSubtitle}>
            Discover a premium collection of digital books for academic, professional, and leisure reading.
          </p>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} />
          </div>
        </div>
      </section>

      <div className="container">
        {/* Featured Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Books</h2>
            <a href="/browse" className={styles.viewAll}>View All</a>
          </div>
          {loading ? (
            <p>Loading books...</p>
          ) : featuredBooks.length > 0 ? (
            <div className={styles.bookGrid}>
              {featuredBooks.map((book: any) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <p>No featured books found.</p>
          )}
        </section>

        {/* Free Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Free for Everyone</h2>
            <a href="/browse?type=free" className={styles.viewAll}>View All Free</a>
          </div>
          <div className={styles.bookGrid}>
            {freeBooks.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>

        {/* Premium Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Premium Selection</h2>
            <a href="/browse?type=premium" className={styles.viewAll}>View All Premium</a>
          </div>
          <div className={styles.bookGrid}>
            {premiumBooks.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
