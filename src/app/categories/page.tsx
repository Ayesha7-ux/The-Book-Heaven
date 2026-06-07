'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book, GraduationCap, Microscope, History, Heart, Lightbulb, BookType, Languages } from 'lucide-react';
import styles from './categories.module.css';

const CATEGORY_MAP: Record<string, any> = {
  'Fiction': { icon: Book, color: '#3b82f6' },
  'Non-Fiction': { icon: BookType, color: '#10b981' },
  'Science': { icon: Microscope, color: '#8b5cf6' },
  'History': { icon: History, color: '#f59e0b' },
  'Self-help': { icon: Heart, color: '#ef4444' },
  'Education': { icon: GraduationCap, color: '#06b6d4' },
  'Academic': { icon: Lightbulb, color: '#6366f1' },
  'Literature': { icon: Languages, color: '#ec4899' },
};

export default function CategoriesPage() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        const books = data.books || [];
        
        const counts: Record<string, number> = {};
        books.forEach((b: any) => {
          counts[b.category] = (counts[b.category] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Explore Categories</h1>
        <p className={styles.subtitle}>Find your next favorite book by exploring our diverse collection.</p>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className={styles.categoryGrid}>
          {Object.entries(CATEGORY_MAP).map(([name, meta]) => {
            const Icon = meta.icon;
            return (
              <Link 
                key={name} 
                href={`/browse?category=${name}`}
                className={styles.categoryCard}
                style={{ '--brand-color': meta.color } as any}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={32} color={meta.color} />
                </div>
                <h3 className={styles.categoryName}>{name}</h3>
                <p className={styles.bookCount}>{categoryCounts[name] || 0} Books</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
