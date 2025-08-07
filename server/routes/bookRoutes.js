const express = require('express');
const router = express.Router();
const { getAllBooks, createBook, getBookById } = require('../controllers/bookController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', getAllBooks);
router.post('/', authenticateToken, createBook); // 🔐 protect this
router.get('/:id', getBookById);

module.exports = router;
