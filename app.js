var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var country = require('./routes/country');
app.io = require('socket.io')();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');



// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(favicon(path.join(__dirname, 'public/icons', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'bower_components')));

//passport config
var User = require('./models').User;
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    where: {
      'username': username
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Incorrect credentials.' })
    }
    if (passwordHash.verify(password,user.dataValues.password)) {
      return done(null, user)
    }
    return done(null, false, { message: 'Incorrect credentials.' })
  })
}));
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(obj, done){
  done(null, obj);
});

app.use("/",routes);//get start page
app.use("/countries.json",country);//get country list
var users = require('./routes/users')(app.io);
app.use("/users",users);
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
