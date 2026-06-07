import { NextResponse } from 'next/server';
import { deleteBook, updateBook } from '@/lib/books';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const success = deleteBook(id);
  
  if (success) {
    return NextResponse.json({ message: 'Book deleted successfully' });
  } else {
    return NextResponse.json({ message: 'Failed to delete book' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const updates = await request.json();
    const success = updateBook(id, updates);
    if (success) {
      return NextResponse.json({ message: 'Book updated successfully' });
    } else {
      return NextResponse.json({ message: 'Failed to update book' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
