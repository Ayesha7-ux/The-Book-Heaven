import Link from 'next/link';
import { Star } from 'lucide-react';
import styles from './BookCard.module.css';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    category: string;
    coverImage: string;
    isPremium: boolean;
    averageRating: number;
  };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book._id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={book.coverImage} alt={book.title} className={styles.image} />
        {book.isPremium ? (
          <span className={`${styles.badge} ${styles.premiumBadge}`}>Premium</span>
        ) : (
          <span className={`${styles.badge} ${styles.freeBadge}`}>Free</span>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <div className={styles.footer}>
          <span className={styles.category}>{book.category}</span>
          <div className={styles.rating}>
            <Star size={14} className={styles.star} fill="currentColor" />
            <span>{book.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
