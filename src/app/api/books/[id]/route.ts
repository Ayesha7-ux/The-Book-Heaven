import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const book = await Book.findById(id);
...
    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    // Increment views
    book.views += 1;
    await book.save();

    return NextResponse.json({ book }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Logic for updating (admin only)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Logic for deleting (admin only)
}
