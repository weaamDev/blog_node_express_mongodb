var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
//const passport = require('passport')
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
  secret: process.env.SECRET, //pour renforcée la sécurité
  store:Store,
  resave: true,
  saveUninitialized: true, //est ce que vous voulez sauvegarder des info qui se trouve sur ordinateur que l'utilisateur que votre server n'a pas initialiser
  cookie: { secure: false, maxAge: 14400000 },
}))

for (let index = 0; index < 8; index++) {
  // var article = new Article({
  //   name: "La description En littérature"+index,
  //   content: "La description (du latin descriptio) est la présentation de lieux, de personnages ou d'événements dans un récit. Sommaire. 1 En littérature"+index,
  //   publishedAt: Date.now()
  // })
  
//  article.save()
//   .then(()=> console.log('sauvegard réussie'))
//   .catch(()=> console.log('sauvegarder échouée'));
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev')); {}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Init flash

// app.use(express.session({ cookie: { maxAge: 60000 }}));
// app.use((req,res,next)=> {
//   if(req.session.userId ) {
//     Article.find({author : req.session.userId}) 
//     .then((articles)=> {
//       if(articles) {
//         console.log(articles)
//         req.session.articles = articles
//         req.session.save()
//       }
//        else {
//         console.log('add new')
//        }
     
//     })  
//     .catch(()=> {
//       next()
//     })
//   }
//   next()
// })
app.use(flash());
app.use((req,res,next) => {
  // if (req.user) {
  //   console.log('tessst')
  //   res.locals.user = req.user;
  // }
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  // res.locals.errorFormArticle = req.flash('errorFormArticle');
  res.locals.errorFormCategory = req.flash('errorFormCategory');
  res.locals.warning = req.flash('warning');
  next()
})

// const isAuth = (req, res, next) => {
//   if(req.user) {
//     next();
//   } else {
//     res.redirect('/')
//   }
// }
//Init Passport
// app.use(passport.initialize());
// app.use(passport.session());

//passport local mongoose
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

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

