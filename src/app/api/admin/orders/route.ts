import { NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/lib/orders';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  if (!id || !status) return NextResponse.json({ message: 'ID and status are required' }, { status: 400 });

  const success = updateOrderStatus(id, status);
  if (success) return NextResponse.json({ message: 'Order updated' });
  return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
}
