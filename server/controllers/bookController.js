const pool = require('../db');

// GET /api/books
const getAllBooks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('[GET ALL BOOKS ERROR]', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/books
const createBook = async (req, res) => {
  const { title, author, description = '', cover_url = '', category = 'Uncategorized' } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, description, cover_url, category, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [title, author, description, cover_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[CREATE BOOK ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/books/:id
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[GET BOOK BY ID ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  getBookById,
};
