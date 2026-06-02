'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Checking authorization...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--serif-font)', fontSize: '2.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Manage your library and monitor analytics</p>
      </div>
      {children}
    </div>
  );
}
