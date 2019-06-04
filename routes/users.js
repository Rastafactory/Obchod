var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local');

var User = require('../models/user');

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid Username or Password'}),
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

router.post('/register', upload.single('profileimage'), function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    if(req.file){
        console.log('Uploading File...');
        var profileimage = req.file.filename;
    }else{
        console.log('No File Uploaded...');
        var profileimage = 'noimage.jpg';
    }
    
    // Form Validator
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    //Check Errors
    var errors = req.validationErrors();
    var emailNotAvailable = false;

    User.validateEmailAccessibility(email, function(result){
        if (result){
            emailNotAvailable = true;
        }
    });
    
    if(errors){
        console.log(errors);
        res.render('register',{
            errors: errors            
        });
    }else if(emailNotAvailable){
        res.render('register',{
            errors: 'Email is already used. Please use another one.'            
        });
    }else{
        var newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password,
            profileimage: profileimage
        });
        
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
        
        req.flash('success', 'You are now registered and can login');
        
        res.location('/users/login');
        res.redirect('/users/login');
    }
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
});

module.exports = router;