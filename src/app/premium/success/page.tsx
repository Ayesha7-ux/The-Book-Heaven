'use client';

import Link from 'next/link';
import { PartyPopper, BookOpen, ArrowRight } from 'lucide-react';

export default function PremiumSuccessPage() {
  return (
    <div className="container" style={{ 
      padding: '6rem 0', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        background: 'var(--muted)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)'
      }}>
        <PartyPopper size={50} />
      </div>

      <h1 style={{ fontFamily: 'var(--serif-font)', fontSize: '3rem', color: 'var(--primary)' }}>
        Welcome to Premium!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--muted-foreground)', maxWidth: '600px' }}>
        Your account has been successfully upgraded. You now have unlimited access to every book in our library, including all premium titles.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
        <Link href="/browse" style={{
          padding: '1rem 2.5rem',
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          borderRadius: 'var(--radius)',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Start Reading <BookOpen size={20} />
        </Link>
        <Link href="/" style={{
          padding: '1rem 2.5rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Back to Home <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
