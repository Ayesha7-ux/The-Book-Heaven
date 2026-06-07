import path from 'path';
import fs from 'fs';
import ClientRead from './ClientRead';

export const dynamic = 'force-dynamic';

export default function ReadPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const filePath = path.join(process.cwd(), 'public', 'data', 'books.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const book = (data.books || []).find((b: any) => String(b._id) === String(id));

  if (!book) return <div style={{ padding: '2rem' }}>Book not found.</div>;

  return <ClientRead book={book} id={id} />;
}
