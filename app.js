var createError = require('http-errors');
var express = require('express');
const fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var compression = require('compression');
const session = require('express-session');
const flash = require('connect-flash');
const constants=require('./config/constants');
const common=require('./config/common');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/carts');
var ordersRouter = require('./routes/orders');
var postsRouter = require('./routes/posts');

var expressLayouts = require('express-ejs-layouts');
var app = express();
app.use(compression());
require('./config/passport')(passport);
require('./config/passport_facebook')(passport);
require('./config/passport_google')(passport);
require('./config/passport_zalo')(passport);
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('view engine', 'ejs');
app.set('layout','layouts/master');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  createParentPath: true
}));
app.use(session({secret: 'secret',resave: true,saveUninitialized: true}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
//partial
app.use(async  function (req, res, next) {
  res.locals.title_company="Shop Online";
  res.locals.url_server=constants.url_server;
  res.locals.user = req.user;
  res.locals.master_categorys= await common.api_get(constants.url_server+"/categorys/listParent");
  res.locals.master_posts_type= await common.api_get(constants.url_server+"/posts_types/list");
  var list_cart=null;
  if(req.user){
    list_cart= await common.api_get(constants.url_server+"/cart/list/"+req.user._id);
  }
  res.locals.master_cart=list_cart;
  res.locals.common=common;
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartRouter);
app.use('/orders', ordersRouter);
app.use('/posts', postsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
