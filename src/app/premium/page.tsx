'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Shield, Star, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './premium.module.css';

export default function PremiumPage() {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login?redirect=/premium');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // For static demo, toggle local premium flag
      localStorage.setItem('mock_is_premium', 'true');
      if (checkAuth) checkAuth();
      router.push('/premium/success');
    } catch (error) {
      alert('Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Elevate Your Reading Experience</h1>
        <p className={styles.subtitle}>Unlock the full potential of The Book Heaven with our Premium plan.</p>
      </div>

      <div className={styles.pricingWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Zap size={40} color="var(--accent)" />
            <h2 className={styles.planName}>Premium Plan</h2>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>9.99</span>
              <span className={styles.period}>/month</span>
            </div>
          </div>

          <ul className={styles.features}>
            <li><Check size={18} color="#22c55e" /> Unlimited access to all premium books</li>
            <li><Check size={18} color="#22c55e" /> Priority access to new releases</li>
            <li><Check size={18} color="#22c55e" /> Ad-free reading experience</li>
            <li><Check size={18} color="#22c55e" /> Download for offline reading (coming soon)</li>
            <li><Check size={18} color="#22c55e" /> Support your favorite authors</li>
          </ul>

          <button 
            onClick={handleUpgrade} 
            disabled={loading || user?.isPremium}
            className={styles.upgradeBtn}
          >
            {loading ? <Loader2 className="animate-spin" /> : user?.isPremium ? 'Already Premium' : 'Upgrade Now'}
          </button>
          
          <p className={styles.secure}>
            <Shield size={14} /> Secure Payment Processing
          </p>
        </div>
      </div>
    </div>
  );
}
