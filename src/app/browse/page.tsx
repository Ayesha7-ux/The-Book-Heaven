'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '@/components/BookCard';
import styles from './browse.module.css';

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Self-help', 'Education', 'Academic', 'Literature'];

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data.books || []);
        setFilteredBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching books', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;

    if (typeFilter === 'free') {
      result = result.filter(b => !b.isPremium);
    } else if (typeFilter === 'premium') {
      result = result.filter(b => b.isPremium);
    }

    if (category !== 'All') {
      result = result.filter(b => b.category === category);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(s) || 
        b.author.toLowerCase().includes(s) ||
        b.category.toLowerCase().includes(s)
      );
    }

    setFilteredBooks(result);
  }, [search, category, books, typeFilter]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {typeFilter === 'free' ? 'Free Books' : typeFilter === 'premium' ? 'Premium Library' : 'Browse All Books'}
        </h1>
        <p className={styles.subtitle}>Discover thousands of books across multiple categories.</p>
      </div>

      <div className={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search books..." 
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select 
          className={styles.categorySelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : filteredBooks.length > 0 ? (
        <div className={styles.bookGrid}>
          {filteredBooks.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3>No books found matching your criteria.</h3>
          <p>Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
}
