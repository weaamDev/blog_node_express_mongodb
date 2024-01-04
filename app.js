var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var User = require('./models/user.model');
var Article = require('./models/article.model');
var session = require('express-session');
const flash = require('connect-flash');
const dotEnv = require('dotenv').config();
const  MongoDBStore  =  require ( 'connect-mongodb-session' ) ( session ) ;
var app = express();



app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connecter'))
.catch(()=>console.log('Echec de connection'));

var  Store  =  new  MongoDBStore ( { 
  uri : process.env.DATABASE , 
  collection : 'sessions' 
} ) ;

app.use(session({
  secret: process.env.SECRET,
  store:Store,
  resave: true,
  saveUninitialized: true, 
  cookie: { secure: false, maxAge: 14400000 },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev')); {}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Init flash

app.use(flash());
app.use((req,res,next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  res.locals.errorFormCategory = req.flash('errorFormCategory');
  res.locals.warning = req.flash('warning');
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);

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

app.listen(3003,()=>console.log(`http://localhost:3003`))
module.exports = app;

