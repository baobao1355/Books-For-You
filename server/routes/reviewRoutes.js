const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook } = require('../controllers/reviewController');

router.post('/', createReview);             // Now works for both guests & logged-in users
router.get('/:bookId', getReviewsByBook);   // Get reviews for a book

module.exports = router;
