'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Star, Trash2, Edit, Filter } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const json = await res.json();
      setBooks(json.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setBooks(books.filter((b: any) => b._id !== id));
        } else {
          alert('Failed to delete book');
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'premium' && book.isPremium) || 
                         (filter === 'free' && !book.isPremium);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div>Loading books...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Books</h1>
          <p className="text-muted-foreground">Add, edit, or remove books from your library.</p>
        </div>
        <Link 
          href="/admin/add-book" 
          className="bg-accent text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} /> Add New Book
        </Link>
      </div>

      <div className="bg-card-bg p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <select 
            className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
          </select>
        </div>
      </div>

      <div className="bg-card-bg rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={book.coverImage} alt="" className="w-12 h-16 object-cover rounded shadow-sm" />
                      <div>
                        <div className="font-bold text-foreground">{book.title}</div>
                        <div className="text-sm text-muted-foreground">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{book.category}</td>
                  <td className="px-6 py-4 text-sm font-medium">{book.stock || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.isPremium 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {book.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye size={14} /> {book.views}</span>
                      <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {book.averageRating?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/edit/${book._id}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(book._id)}
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
        {filteredBooks.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No books found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
