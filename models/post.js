const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
	title: String,
	price: String,
	description: String,
	images: [ { url: { type: String,
		default: '/images/default-post.png' 
	}, 
				public_id: String,  
			} ],
	location: String,
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			// required: true
		},
		coordinates: {
			type: [Number],
			// required: true
		}
	},
	properties: {
		description: String
	},
	website: String,
	phone: String,
	// hours: [{day:String, hourStart: String, hourEnd: String}],
	hours: [String],
	categories: [String],
	music: [String],
	// crowd: {crowdOne: String, crowdTwo: String, crowdThree: String,  },
	crowd: [String],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	isSocial: String,
	onlineOnly: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	avgRating: { type: Number, default: 0 }
});

PostSchema.pre('remove', async function() {
	await Review.remove({
		_id: {
			$in: this.reviews
		}
	});
});

PostSchema.methods.calculateAvgRating = function() {
	let ratingsTotal = 0;
	if(this.reviews.length) {
		this.reviews.forEach(review => {
			ratingsTotal += review.rating;
		});
		this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
	} else {
		this.avgRating = ratingsTotal;
	}
	const floorRating = Math.floor(this.avgRating);
	this.save();
	return floorRating;
}


PostSchema.plugin(mongoosePaginate);

PostSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
