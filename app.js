if (process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}


const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');


const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
// const seedPosts = require('./seeds');
// seedPosts();

// require routes
const User = require('./models/user');
const index 	= require('./routes/index');
const posts 	= require('./routes/posts');
const reviews = require('./routes/reviews');
const replies = require('./routes/replies')
const helmet = require('helmet');

const MongoDBStore = require("connect-mongo")(session);

// const mongoSanitize = require('express-mongo-sanitize')
const app = express();

// connect to the database

const dbUrl = 'mongodb://localhost:27017/surf-shop';
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/surf-shop'

// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useCreateIndex: true
// });
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!'); 
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set public assets directory
app.use(express.static('public'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
// app.use(mongoSanitize)


//Add moment to every view
app.locals.moment = require('moment');

// app.use(mongoSanitize({
//   replaceWith: '_'
// }))
const secret = process.env.secret || 'hang ten dude!';

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e)
});

// Configure Passport and Sessions
app.use(session({
  store,
  name:'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(helmet({contentSecurityPolicy: false}));
app.use(helmet())



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://code.jquery.com/",
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    "https://cdnjs.cloudflare.com/",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js/",
    "https://cdn.jsdelivr.net",
    "api.fontawesome.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
  "https://use.fontawesome.com/",
  "https://fonts.gstatic.com/",
 
];


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["*", 'unsafe-inline', 'unsafe-eval', "data: blob:"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dnrh8742s/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next) {
  // req.user = {
  //   '_id' : '5d35ca2944a91b20684dd02c',
  //   'username' : 'mo'
  // }
  res.locals.currentUser = req.user;
  // set default page title
  res.locals.title = 'BizHub';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();
});

// Mount express-sanitizer middleware here
app.use(expressSanitizer());

// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);
app.use('/posts/:id/reviews/:review_id/replies', replies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
module.exports = app;
