var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    var a = new Date();
    var date = a.toString().substr(4, 11);
    
    User.find({}, { email: 1, username: 1, firstname:1, lastname:1 }, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });
        console.log(users);
    
  res.render('index2', {
      date: date,
      users: users
  });
});
    });

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/product_detail', function(req, res, next) {
  res.render('product_detail', {
  });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;
