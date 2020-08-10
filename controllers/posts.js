const Post = require('../models/post');
const Review = require('../models/review');
const User = require('../models/user')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports = {
	// Posts Index
	async postIndex(req, res, next) {
		const { dbQuery } = res.locals;
		delete res.locals.dbQuery;
		let posts = await Post.paginate(dbQuery, {
			page: req.query.page || 1,
			limit: 10,
			sort: '-_id'
		});
		
		posts.page = Number(posts.page);
		if (!posts.docs.length && res.locals.query) {
			res.locals.error = 'No results match that query.';
		}
	
		res.render('posts/index', {
			posts, 
			mapBoxToken,
			title: 'Posts Index'
		});
	},
	// Posts New
	postNew(req, res, next) {
		res.render('posts/new', {title: 'New Biz Form'});
	},
	// Posts Create
	async postCreate(req, res, next) {
		req.body.post.images = [];
		req.body.images = [];
		// checks if the user uploaded an image

		// console.log("req.files... " + req.files)
		// console.log("type req.file... " +  typeof req.files)
		// console.log("req.files.length == [] " + req.files.length == [])
		
		if(req.files.length == [])
		{
			//default image is placed if the user doesn't upload an image
			req.body.post.images.push({secure_url:'/images/default-post.png' , public_id: ''})
		} else {
		for(const file of req.files) {
			req.body.post.images.push({
				url: file.secure_url,
				public_id: file.public_id
				
			});
		}
	}
		//checks if the user enter a location
		if(req.body.post.location){
			let response = await geocodingClient
		  .forwardGeocode({
		    query: req.body.post.location,
		    limit: 1
		  })
		  .send();
		req.body.post.geometry = response.body.features[0].geometry;
		}
		
		//assigns the user as the author of the post
		req.body.post.author = req.user._id;


		//adds http to websites if not present
		if(!req.body.post.website.startsWith('http://')){
			req.body.post.website = 'http://' + req.body.post.website
		}
	
		//assigns business owner to post
		//search the database for email the user entered
		const email = req.body.post.businessOwnerEmail;
		//assigns found email to post.bizOwner
		const bizOwner = await User.findOne({ email })
			// console.log('bizOwner: ' + bizOwner)
		//checks if email is found and assigns user as owner 
		if (bizOwner){
			req.body.post.owner = bizOwner
			
		} else {
			//if email is not found, assigns an admin as the owner
			
			const notClaimed = await User.findOne({ isAdmin: true })
			req.body.post.owner = notClaimed
			req.session.error= 'There is no user with this email. Please register first';
			
		}
		
		//  await User.findOne({ email }, async function(err,foundOwner){
		// 	 console.log("err:   " + err)
		// 	if(err == null) {
		
		// 		req.body.post.owner = await User.findOne({ isAdmin: 'true' })
				// console.log('not claimed: ' + req.body.post.owner)
				
		// 		req.session.error= 'There is no user with that email or this business was not claimed.'
		// 		 req.body.post.owner.save()
		// 	} else {
		// 		req.body.post.owner = foundOwner;
		// 		console.log('foundOwner ' + foundOwner)
		// 	}
			
		// })
		

		let post = new Post(req.body.post);
	
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

		
		await post.save();
		req.session.success = 'Post created successfully!';
		res.redirect(`/posts/${post.id}`);
	},
	// Posts Show
	async postShow(req, res, next) {
		// let post = await Post.findById(req.params.id).populate({
		// 	path: 'reviews',
		// 	options: { sort: { '_id': -1 } },
		// 	populate: {
		// 		path: 'author',
		// 		model: 'User',
				
		// 	}	
		// }).populate({
		// 	path: 'owner'
		// })

		// let reviewReply = await Review.find(req.params.review_id).populate({
		// 	path: 'replies', 
		// 	populate: {
		// 		path: 'author',
		// 		model: 'User',
		// 	},
		// })
		let post = await Post.findById(req.params.id).populate({
			path: 'reviews owner',
			options: { sort: { '_id': -1 } },
			populate: {
				path: 'author',
				model: 'User',
			}	
		})

		let reviewReply = await Review.find(req.params.review_id).populate({
			path: 'replies likes', 
			populate: {
				path: 'author',
				model: 'User',
			},
		})

		console.log('controllers/post.js : ' + post)

		const floorRating = post.calculateAvgRating();
		let mapBoxToken = process.env.MAPBOX_TOKEN;
		res.render('posts/show', { post, reviewReply, mapBoxToken, floorRating });
	},
	// Posts Edit
	postEdit(req, res, next) {
		res.render('posts/edit', {title: 'Biz Edit'});
	},
	// Posts Update
	async postUpdate(req, res, next) {
		// destructure post from res.locals
		const { post } = res.locals;
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				//checks if public_id is an empty string
				//default image's public_id is an empty string
				if(public_id != ''){
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				}
				// delete image from post.images
				for(const image of post.images) {
					if(image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
			// upload images
			for(const file of req.files) {
				// add images to post.images array
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
				});
			}
		}
		//checks if the user enter a location
		if(req.body.post.location){
		//check if location was updated
		if(req.body.post.location !== post.location) {
			let response = await geocodingClient
			  .forwardGeocode({
			    query: req.body.post.location,
			    limit: 1
			  })
			  .send();
			post.geometry = response.body.features[0].geometry;
			post.location = req.body.post.location;
		}
	}
		//update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.crowd = req.body.post.crowd;
		post.music = req.body.post.music;
		post.price = req.body.post.price;
		post.isSocial = req.body.post.isSocial;
		post.onlineOnly= req.body.post.onlineOnly;
		post.phone = req.body.post.phone;
		post.hours = req.body.post.hours;
		post.categories = req.body.post.categories;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

		
		//updates the owner
		if(req.body.post.businessOwnerEmail){
			const email = req.body.post.businessOwnerEmail;
			const bizOwner2 = await User.findOne({ email })
			console.log('bizOwner2: ' + bizOwner2)
		if (bizOwner2){
			// req.body.post.owner = bizOwner
			post.owner  = bizOwner2
			
		} else {
			
			req.session.error= 'There is no user with this email.';
		}
	}
		
		//adds http to websites if not present
		if(!req.body.post.website.startsWith('http://')){
			post.website = 'http://' + req.body.post.website
		}

		// save the updated post into the db
		await post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},
	// Posts Destroy
	async postDestroy(req, res, next) {
		const { post } = res.locals;
			for(const image of post.images) {
				//checks if public_id is an empty string
				//default image's public_id is an empty string
				if(image.public_id != ''){
					await cloudinary.v2.uploader.destroy(image.public_id);
				}
			}
		await post.remove();
		req.session.success = 'Post deleted successfully!';
		res.redirect('/posts');
		
	}
}
