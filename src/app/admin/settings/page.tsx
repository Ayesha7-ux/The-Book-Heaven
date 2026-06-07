'use client';

import { Save, Bell, Lock, Globe, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">General Settings</h1>
        <p className="text-muted-foreground">Configure your admin panel preferences and store details.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <User className="text-accent" />
            <h2 className="text-xl font-bold font-serif">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Admin Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-border bg-background" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-border bg-background" defaultValue="admin@thebookheaven.com" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Bell className="text-accent" />
            <h2 className="text-xl font-bold font-serif">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              'Email notifications for new orders',
              'Alert on low book stock',
              'Weekly analytics report',
              'New user registration alerts'
            ].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item}</span>
                <input type="checkbox" className="w-5 h-5 accent-accent" defaultChecked />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Lock className="text-accent" />
            <h2 className="text-xl font-bold font-serif">Security</h2>
          </div>
          <div className="p-6">
            <button className="text-accent font-medium hover:underline">Change Admin Password</button>
            <p className="text-xs text-muted-foreground mt-2">Last changed 3 months ago.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-accent text-white px-8 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <Save size={20} /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
