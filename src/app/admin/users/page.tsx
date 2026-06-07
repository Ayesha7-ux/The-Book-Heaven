'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Shield, ShieldOff, User as UserIcon } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      setUsers(json.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter((u: any) => u.id !== id));
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const toggleBlock = async (user: any) => {
    const isBlocked = !!user.isBlocked;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, updates: { isBlocked: !isBlocked } })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isBlocked: !isBlocked } : u));
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage registered users and their permissions.</p>
      </div>

      <div className="bg-card-bg p-4 rounded-xl border border-border shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="text-red-600 flex items-center gap-1 text-sm">
                        <ShieldOff size={14} /> Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 flex items-center gap-1 text-sm">
                        <Shield size={14} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.isPremium ? 'text-accent font-medium' : 'text-muted-foreground text-sm'}>
                      {user.isPremium ? 'Premium' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleBlock(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isBlocked ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <Shield size={18} /> : <ShieldOff size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
