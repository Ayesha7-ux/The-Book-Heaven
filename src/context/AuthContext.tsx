'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  upgrade: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readLocalUsers(): any[] {
  try {
    const raw = localStorage.getItem('mock_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalUsers(users: any[]) {
  try {
    localStorage.setItem('mock_users', JSON.stringify(users));
  } catch (e) {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const raw = localStorage.getItem('mock_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Load seeded users from /public/data/users.json and merge with local mock users
    const res = await fetch('/data/users.json');
    const seed = await res.json();
    const seededUsers: any[] = seed.users || [];
    const localUsers = readLocalUsers();
    const users = [...localUsers, ...seededUsers];

    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');

    const authUser: User = {
      id: found.id || String(Date.now()),
      name: found.name,
      email: found.email,
      role: found.role || 'user',
      isPremium: !!found.isPremium,
    };

    localStorage.setItem('mock_user', JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  };

  const register = async (name: string, email: string, password: string) => {
    const newUser = { id: 'u' + Date.now(), name, email, password, role: 'user', isPremium: false };
    const localUsers = readLocalUsers();
    localUsers.unshift(newUser);
    saveLocalUsers(localUsers);
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  const upgrade = () => {
    if (!user) return;
    const upgraded = { ...user, isPremium: true };
    setUser(upgraded);
    localStorage.setItem('mock_user', JSON.stringify(upgraded));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, upgrade }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
