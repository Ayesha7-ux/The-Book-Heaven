import { NextResponse } from 'next/server';
import { getUsers, deleteUser, updateUser } from '@/lib/users';

export async function GET() {
  const users = getUsers();
  return NextResponse.json({ users });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

  const success = deleteUser(id);
  if (success) return NextResponse.json({ message: 'User deleted' });
  return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
}

export async function PATCH(request: Request) {
  const { id, updates } = await request.json();
  if (!id) return NextResponse.json({ message: 'ID is required' }, { status: 400 });

  const success = updateUser(id, updates);
  if (success) return NextResponse.json({ message: 'User updated' });
  return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
}
