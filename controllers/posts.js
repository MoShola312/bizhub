const Post = require('../models/post');
const Review = require('../models/review');
const User = require('../models/user')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const  sortByDay  = require('../public/javascripts/sortDays');



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

		if(req.files.length == [])
		{
			//default image is placed if the user doesn't upload an image
			req.body.post.images.push({path:'/images/default-post.png' , filename: ''})
		} else {
		for(const file of req.files) {
			req.body.post.images.push({
				path: file.path,
				filename: file.filename
				
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
		

		req.body.post.hours = []
		
		// console.log(req.body.hours)
		// console.log(req.body.hours.length)

		
		//parsing the info from the post-create
		//pushing info into req.body.post.hours
	   for(const j in req.body.hours){
			req.body.post.hours.push(JSON.parse(req.body.hours[j]))
		}

		// console.log(req.body.post.hours)
		// console.log(req.body.post.hours.length)
		

		//sorts the days in order
		req.body.post.hours.sort(sortByDay)


		//assigns the user as the author of the post
		req.body.post.author = req.user._id;

	
		//adds http to websites if not present
		if(req.body.post.website){
			if(!req.body.post.website.startsWith('http://') || (!req.body.post.website.startsWith('https://'))){
				req.body.post.website = 'http://' + req.body.post.website
			}
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
			path: 'replies', 
			populate: {
				path: 'author',
				model: 'User',
			},
		})

	console.log(post)

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
			for(const filename of deleteImages) {
				//checks if filename is an empty string
				//default image's filename is an empty string
				if(filename != ''){
				// delete images from cloudinary
				await cloudinary.uploader.destroy(filename);
				}
				// delete image from post.images
				for(const image of post.images) {
					if(image.filename === filename) {
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
					path: file.path,
					filename: file.filename
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
		
		// console.log(req.body.hours.length)
		// console.log(req.body.hours)
		// console.log(req.body.hours)


		//parsing the info from edit
		//pushing info into postObj
		let postObj = [];
		for(const j in req.body.hours){
			postObj.push(JSON.parse(req.body.hours[j]))
		}
		//set info to database values
		post.hours= postObj
		
		//sort days of week in order
		post.hours.sort(sortByDay)
		

		post.categories = req.body.post.categories;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

		
		//updates the owner
		if(req.body.post.businessOwnerEmail){
			const email = req.body.post.businessOwnerEmail;
			const bizOwner2 = await User.findOne({ email })
			// console.log('bizOwner2: ' + bizOwner2)
			if (bizOwner2){
				// req.body.post.owner = bizOwner
				post.owner  = bizOwner2
				
			} else {
				
				req.session.error= 'There is no user with this email.';
			}
		}
		
		//adds http to websites if not present
		if(req.body.post.website){
			if(!req.body.post.website.startsWith('http://') || !req.body.post.website.startsWith('https://')){
				post.website = 'http://' + req.body.post.website
			}
		}
		

		// save the updated post into the db
		await post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},
	//Posts image gallery
	async postGallery(req, res, next)  {
		let post = await Post.findById(req.params.id)
		//render the page   
		res.render('posts/biz_photos', {post: post})
		
	},
	// Posts Destroy
	async postDestroy(req, res, next) {
		const { post } = res.locals;
			for(const image of post.images) {
				//checks if filename is an empty string
				//default image's filename is an empty string
				if(image.filename != ''){
					await cloudinary.uploader.destroy(image.filename);
				}
			}
		await post.remove();
		req.session.success = 'Post deleted successfully!';
		res.redirect('/posts');
		
	}
}
