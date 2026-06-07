import { NextResponse } from 'next/server';
import { getBooks, saveBook } from '@/lib/books';

export async function GET() {
  const books = getBooks();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  try {
    const book = await request.json();
    if (!book.title || !book.author) {
      return NextResponse.json({ message: 'Title and author are required' }, { status: 400 });
    }
    
    const newBook = {
      ...book,
      _id: book._id || 'b' + Date.now(),
      views: book.views || 0,
      averageRating: book.averageRating || 0,
    };

    const success = saveBook(newBook);
    if (success) {
      return NextResponse.json({ message: 'Book added successfully', book: newBook });
    } else {
      return NextResponse.json({ message: 'Failed to save book' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
