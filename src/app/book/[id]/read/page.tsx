'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const Reader = dynamic(() => import('@/components/Reader'), { ssr: false });

export default function ReadPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div style={{ padding: '2rem' }}>Preparing your book...</div>;
  if (!book) return <div style={{ padding: '2rem' }}>Book not found.</div>;

  const canRead = !book.isPremium || (user && user.isPremium) || (user && user.role === 'admin');

  if (!canRead) {
    router.push(`/book/${id}`);
    return null;
  }

  return (
    <Reader 
      pdfUrl={book.pdfUrl} 
      title={book.title} 
      onClose={() => router.push(`/book/${id}`)} 
    />
  );
}
