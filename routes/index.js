var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', function(req, res, next) {
  var user=req.user;
  console.log(user);
  res.render('profile');
});

router.get('/stats', function(req, res, next) {
  User.getAllUsers(function(err, players) {
    res.render('stats', { 
      players: players
    });
});
});


module.exports = router;