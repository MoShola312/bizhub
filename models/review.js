const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./reply')

const ReviewSchema = new Schema({
	body: String,
	rating: Number,
	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Reply'
	}
	],
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}	
	],
	createdAt: { type: Date, default: Date.now },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
	
});
ReviewSchema.pre('remove', async function() {
	await Reply.remove({
		_id: {
			$in: this.replies
		}
	});
})
module.exports = mongoose.model('Review', ReviewSchema);
