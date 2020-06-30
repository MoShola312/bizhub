const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
	landingPage,
	getRegister,
	postRegister,
	getLogin,
	postLogin,
	getLogout,
	getProfile,
	updateProfile, 
	getForgotPw,
	putForgotPw,
	getReset,
	putReset,
	getNewBiz,
	postNewBiz
} = require('../controllers');
const {
	asyncErrorHandler,
	isLoggedIn,
	postSanitizer,
	isValidPassword,
	changePassword
} = require('../middleware')

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET posts new /posts/new */
router.get('/new-biz', isLoggedIn, getNewBiz);

/* POST posts new /posts/new */
router.post('/new-biz', asyncErrorHandler(postSanitizer), asyncErrorHandler(postNewBiz));

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile/:id', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile */
router.put('/profile',
	isLoggedIn,
	upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

/* GET /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
