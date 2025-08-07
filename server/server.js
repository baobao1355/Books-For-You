const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));
