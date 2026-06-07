import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'public', 'data', 'books.json');

export function getBooks() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data.books || [];
  } catch (error) {
    console.error('Error reading books file:', error);
    return [];
  }
}

export function saveBook(book: any) {
  try {
    const books = getBooks();
    books.unshift(book);
    fs.writeFileSync(dataFilePath, JSON.stringify({ books }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving book:', error);
    return false;
  }
}

export function updateBook(id: string, updates: any) {
  try {
    const books = getBooks();
    const index = books.findIndex((b: any) => String(b._id) === String(id));
    if (index === -1) return false;
    books[index] = { ...books[index], ...updates };
    fs.writeFileSync(dataFilePath, JSON.stringify({ books }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error updating book:', error);
    return false;
  }
}

export function deleteBook(id: string) {
  try {
    const books = getBooks();
    const filtered = books.filter((b: any) => String(b._id) !== String(id));
    fs.writeFileSync(dataFilePath, JSON.stringify({ books: filtered }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    return false;
  }
}
