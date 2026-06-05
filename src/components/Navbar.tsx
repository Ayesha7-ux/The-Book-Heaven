'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <Link href="/" className={styles.logo}>
          The Book Heaven
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/browse" className={styles.link}>Browse</Link>
          <Link href="/categories" className={styles.link}>Categories</Link>
        </div>

        <div className={styles.actions}>
          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className={styles.userMenu} onClick={() => setShowDropdown(!showDropdown)}>
              <span className={styles.userName}>{user.name}</span>
              <User size={20} />
              
              {showDropdown && (
                <div className={styles.dropdown}>
                  {user.role === 'admin' && (
                    <Link href="/admin" className={styles.dropdownItem}>
                      <Shield size={16} style={{ marginRight: '8px' }} />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/profile" className={styles.dropdownItem}>My Profile</Link>
                  <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                    <LogOut size={16} style={{ marginRight: '8px' }} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={`${styles.authBtn} ${styles.loginBtn}`}>Log In</Link>
              <Link href="/register" className={`${styles.authBtn} ${styles.registerBtn}`}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
