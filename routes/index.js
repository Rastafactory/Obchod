var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/profile/:id', function (req, res, next) {
  var id = req.params.id;

  User.getUserById(id, function (err, currentUser) {
    console.log(currentUser)
    res.render('profile', {
      currentUser: currentUser
    });
  })
});

router.get('/stats', function (req, res, next) {
  User.getAllUsers(function (err, players) {
    res.render('stats', {
      players: players
    });
  });
});


module.exports = router;