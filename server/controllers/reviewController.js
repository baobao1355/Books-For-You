const pool = require('../db');

// POST /api/reviews
const createReview = async (req, res) => {
  const { book_id, rating, comment } = req.body;
  let user_id = null;
  let username = 'Guest';

  // If authenticated, extract user ID and fetch username from DB
  if (req.user && req.user.userId) {
    user_id = req.user.userId;

    try {
      const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [user_id]);
      if (userResult.rows.length > 0) {
        username = userResult.rows[0].username;
      }
    } catch (err) {
      console.error('[USERNAME LOOKUP ERROR]', err);
      return res.status(500).json({ error: 'Server error while fetching username' });
    }
  }

  if (!book_id || !rating) {
    return res.status(400).json({ error: 'Book ID and rating are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, book_id, rating, comment, guest_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, book_id, rating, comment, username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[CREATE REVIEW ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/reviews/:bookId
const getReviewsByBook = async (req, res) => {
  const book_id = req.params.bookId;

  try {
    const result = await pool.query(
      `SELECT r.rating, r.comment, r.created_at,
              COALESCE(u.username, r.guest_name) AS username
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.book_id = $1
       ORDER BY r.created_at DESC`,
      [book_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[GET REVIEWS ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createReview, getReviewsByBook };
