const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isReplyAuthor } = require('../middleware');
const {
	replyCreate,
	replyUpdate,
	replyDestroy
} = require('../controllers/replies');

/* replie replies create /posts/:id/reviews/:review_id/replies */
router.post('/', asyncErrorHandler(replyCreate));

// /* PUT replies update /posts/:id/reviews/:review_id/replies/:reply_id */
router.put('/:reply_id', isReplyAuthor, asyncErrorHandler(replyUpdate));

/* DELETE replies destroy /posts/:id/reviews/:review_id/replies/:reply_id */
router.delete('/:reply_id', isReplyAuthor, asyncErrorHandler(replyDestroy));

module.exports = router;
