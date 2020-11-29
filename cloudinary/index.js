const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: 'dnrh8742s',
	api_key: '851735119382545',
	api_secret: process.env.CLOUDINARY_SECRET
});
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary,
//   folder: 'surf-shop',
  folder: 'bizhub',
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (req, file, cb) {
  	let buf = crypto.randomBytes(16);
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
  	uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});
//  console.log("api_secret " +  process.env.CLOUDINARY_SECRET);
//  console.log("api_token " +  process.env.MAPBOX_TOKEN);
module.exports = {
	cloudinary,
	storage
}