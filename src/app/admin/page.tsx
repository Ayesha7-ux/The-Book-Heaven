'use client';

import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your store's performance and activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card-bg p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card-bg p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-serif">Monthly Sales (Mock)</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-accent rounded-sm"></div> Revenue</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-accent/20 hover:bg-accent rounded-t-sm transition-all duration-300 relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(height * 12.5).toFixed(0)}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-serif">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/books" className="p-4 border border-border rounded-lg hover:bg-muted transition-colors flex flex-col gap-2">
              <BookOpen className="text-accent" />
              <span className="font-medium">Manage Books</span>
            </Link>
            <Link href="/admin/users" className="p-4 border border-border rounded-lg hover:bg-muted transition-colors flex flex-col gap-2">
              <Users className="text-accent" />
              <span className="font-medium">Manage Users</span>
            </Link>
            <Link href="/admin/orders" className="p-4 border border-border rounded-lg hover:bg-muted transition-colors flex flex-col gap-2">
              <ShoppingCart className="text-accent" />
              <span className="font-medium">Recent Orders</span>
            </Link>
            <Link href="/admin/add-book" className="p-4 border border-border rounded-lg hover:bg-muted transition-colors flex flex-col gap-2">
              <DollarSign className="text-accent" />
              <span className="font-medium">Add New Book</span>
            </Link>
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-serif">Library Breakdown</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Free Books</span>
                <span className="font-medium">{stats.freeBooks}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${(stats.freeBooks / stats.totalBooks) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Premium Books</span>
                <span className="font-medium">{stats.premiumBooks}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${(stats.premiumBooks / stats.totalBooks) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-8">
             <Link href="/admin/books" className="text-accent font-medium hover:underline flex items-center gap-2">
                View Full Library <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
