'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Book as BookIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    coverImage: '',
    isPremium: false,
    price: 0,
    stock: 0,
    pdfUrl: ''
  });

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        const book = data.books.find((b: any) => b._id === id);
        if (book) {
          setFormData(book);
        } else {
          router.push('/admin/books');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Note: This project's saveBook in lib/books.ts unshifts the book, 
    // we might need an update function or just reuse saveBook if it handles ID correctly.
    // Actually, looking at src/app/api/books/route.ts, it always adds a new book.
    // I should check if there's an update API.
    // Let's check src/app/api/books/[id]/route.ts.
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/admin/books');
      } else {
        alert('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading book details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/books" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold">Edit Book</h1>
          <p className="text-muted-foreground">Modify the details of "{formData.title}".</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Book Title</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Author Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Stock Quantity</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                placeholder="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price (if premium)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="url" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">PDF File URL</label>
              <div className="relative">
                <BookIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="url" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent/50 outline-none"
                  value={formData.pdfUrl}
                  onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPremium"
              className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
              checked={formData.isPremium}
              onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
            />
            <label htmlFor="isPremium" className="text-sm font-medium text-foreground cursor-pointer">
              Mark as Premium Content
            </label>
          </div>
        </div>

        <div className="bg-muted p-6 flex justify-end gap-4">
          <Link 
            href="/admin/books" 
            className="px-6 py-2 rounded-lg font-medium border border-border hover:bg-background transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={saving}
            className="bg-accent text-white px-8 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : <><Save size={20} /> Update Book</>}
          </button>
        </div>
      </form>
    </div>
  );
}
