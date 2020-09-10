const Post = require('../models/post')
const Review = require('../models/review');
const Reply = require('../models/reply')


module.exports = {
	// Replies Create
	async replyCreate(req, res, next) {
		
		let post = await Post.findById(req.params.id).populate('reviews').exec();
		
		// find the reviw by its id
		// let review = await Review.findById(req.params.review_id).populate('replies').exec();
		// console.log("replies.js review: " + review)
		// console.log("replies.js review params: " + req.params.review_id)
		
		
		req.body.reply.author = req.user._id;
		
		// create the reply
		let reply = await Reply.create(req.body.reply);
		// assign reply to review
		post.reviews.push(reply);
		
	
		
		// save the review
		// review.save();
		post.save();
		// reply.save();
		
		// redirect to the post
		req.session.success = 'Reply created successfully!';
		res.redirect(`/posts/${post.id}`);
	},
	// Reply Update
	async replyUpdate(req, res, next) {
		await Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply);
		req.session.success = 'Reply updated successfully!';
		res.redirect(`/posts/${req.params.id}`);
		
	},
	// Replies Destroy
	async replyDestroy(req, res, next) {
		await Review.findByIdAndUpdate(req.params.review_id, {
			$pull: { replies: req.params.reply_id }
		});
		let reply = await Reply.findById(req.params.reply_id);
		await reply.deleteOne();
		req.session.success = 'Reply deleted successfully!';
		res.redirect(`/posts/${req.params.id}`);
	}
}




