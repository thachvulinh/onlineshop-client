var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const constants=require('./config/constants');
const common=require('./config/common');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
//ckfind
var multer  =   require('multer');
var fs = require('fs')
var crypto = require('crypto');
var storage = multer.diskStorage({
  //folder upload -> public/upload
  destination: 'public/upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, Math.floor(Math.random()*9000000000) + 1000000000 + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage: storage });

var expressLayouts = require('express-ejs-layouts');

var app = express();
require('./config/passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts)
app.set('view engine', 'ejs');
app.set('layout','layouts/master');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//partial
app.use(async  function (req, res, next) {
  res.locals.title_company="Shop Online";
  res.locals.url_server=constants.url_server;
  res.locals.user = req.user;
  res.locals.master_categorys= await common.api_get(constants.url_server+"/categorys/listParent");
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.get('/files', function (req, res) {
  const images = fs.readdirSync('public/upload')
  var sorted = []
  for (let item of images){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
          var abc = {
                "image" : "/upload/"+item,
                "folder" : '/'
          }
          sorted.push(abc)
      }
  }
  res.send(sorted);
})
app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
  res.redirect('back')
});
//delete file
app.post('/delete_file', function(req, res, next){
var url_del = 'public' + req.body.url_del
if(fs.existsSync(url_del)){
  fs.unlinkSync(url_del)
}
res.redirect('back')
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
