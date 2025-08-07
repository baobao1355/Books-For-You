const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const pool = require('./db');

async function seedBooks() {
  let allBooks = [];

  // Fetch 3 pages of results (40 + 40 + 20 = 100)
  for (let i = 0; i < 3; i++) {
    const startIndex = i * 40;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=${startIndex}&maxResults=40`
    );
    const data = await res.json();
    allBooks = allBooks.concat(data.items || []);
  }

  for (const item of allBooks) {
    const title = item.volumeInfo.title;
    const author = item.volumeInfo.authors?.join(', ') || 'Unknown';
    const description = item.volumeInfo.description || '';
    const category = item.volumeInfo.categories?.[0] || 'Unknown';

    const cover_url =
      item.volumeInfo.imageLinks?.thumbnail ||
      'https://via.placeholder.com/200x300?text=No+Cover';

    await pool.query(
      'INSERT INTO books (title, author, description, cover_url, category) VALUES ($1, $2, $3, $4, $5)',
      [title, author, description, cover_url, category]
    );
  }

}


seedBooks();
