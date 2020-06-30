const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isReviewAuthor, isLoggedIn} = require('../middleware');
const {
	reviewCreate,
	reviewUpdate,
	reviewDestroy,
	likeCreate
} = require('../controllers/reviews');

/* review reviews create /posts/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews update /posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));

/* post like route /posts/:id/reviews/:review_id/like */
router.post('/:review_id/like', isLoggedIn, asyncErrorHandler(likeCreate));


module.exports = router;
