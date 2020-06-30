const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
	body: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Reply', ReplySchema);
