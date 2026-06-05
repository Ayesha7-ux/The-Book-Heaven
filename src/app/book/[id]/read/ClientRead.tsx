"use client";

import Reader from '@/components/Reader';

export default function ClientRead({ book, id }: { book: any; id: string }) {
  if (!book) return <div style={{ padding: '2rem' }}>Book not found.</div>;

  return (
    <Reader
      pdfUrl={book.pdfUrl}
      title={book.title}
      onClose={() => {
        window.location.href = `/book/${id}`;
      }}
    />
  );
}
