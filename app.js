// if(process.env.NODE_ENV === 'development') {
    require("dotenv").config();
// }

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var expSession = require('express-session');
var passport = require('passport');
var local = require('passport-local');
const bcrypt = require('bcrypt');
const getUser = require('./db/user/getUser');

var index = require('./routes/index');
var user = require('./routes/users');
var gameroom = require('./routes/gameroom');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expSession({
  secret: 'bazinga',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local({
  passReqToCallback: true
}, (req, username, password, done) => {
  getUser(username, (user,err) => {
    // if (err) { return done(err); }
    if (!user) { console.log("!user"); return done(null, false); }
    return bcrypt.compare(req.body.password, user.password, function(err, res) {
      if (!res) { console.log("Auth failed"); return done(null, false); }
      return done(null, user);
    });
  });
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});

app.use('/', index);
app.use('/user', user);
app.use('/gameroom', gameroom);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
});

module.exports = app;
