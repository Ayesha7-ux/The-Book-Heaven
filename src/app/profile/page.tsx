'use client';

import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Star, Calendar } from 'lucide-react';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Access Denied</h1>
        <p>Please log in to view your profile.</p>
        <a href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--accent)', fontWeight: '600' }}>
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <User size={64} />
        </div>
        <div className={styles.userInfo}>
          <h1>{user.name}</h1>
          <div className={styles.userEmail}>
            <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {user.email}
          </div>
          <span className={`${styles.badge} ${user.isPremium ? styles.premiumBadge : styles.freeBadge}`}>
            {user.isPremium ? 'Premium Member' : 'Standard Member'}
          </span>
        </div>
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.infoCard}>
          <h3>Account Information</h3>
          <div className={styles.infoRow}>
            <span className={styles.label}>User ID:</span>
            <span className={styles.value}>{user.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Role:</span>
            <span className={styles.value} style={{ textTransform: 'capitalize' }}>
              <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {user.role}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Member Since:</span>
            <span className={styles.value}>
              <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              June 2026
            </span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Reading Stats</h3>
          <div className={styles.infoRow}>
            <span className={styles.label}>Books Read:</span>
            <span className={styles.value}>12</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Favorite Genre:</span>
            <span className={styles.value}>Fiction</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Current Status:</span>
            <span className={styles.value}>
              <Star size={14} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#f59e0b' }} />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
