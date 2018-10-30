var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local');

var User = require('../models/user');

router.get('/register', function(req, res, next) {
  res.render('register', {cart: req.session.cart});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/register', failureFlash:'Invalid Username or Password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }
        
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {message:'Invalid Password'});
            }
        });
    });
}));

router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    console.log("password" + req.body.password);
    console.log("password" + req.body.password2);
    
    // Form Validator
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    //Check Errors
    var errors = req.validationErrors();
    
    if(errors){
        console.log(errors);
        res.render('register',{
            errors: errors            
        });
    }else{
        var newUser = new User({
            email: email,
            username: username,
            password: password
        });
        
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
        
        req.flash('success', 'You are now registered and can login');
        
        res.location('/users/register');
        res.redirect('/users/register');
    }
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/register');
});

module.exports = router;
