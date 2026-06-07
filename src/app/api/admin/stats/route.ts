import { NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';
import { getUsers } from '@/lib/users';
import { getOrders } from '@/lib/orders';

export async function GET() {
  const books = getBooks();
  const users = getUsers();
  const orders = getOrders();

  const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
  
  const stats = {
    totalBooks: books.length,
    totalUsers: users.length,
    totalOrders: orders.length,
    revenue: totalRevenue,
    freeBooks: books.filter((b: any) => !b.isPremium).length,
    premiumBooks: books.filter((b: any) => b.isPremium).length,
  };

  return NextResponse.json(stats);
}
