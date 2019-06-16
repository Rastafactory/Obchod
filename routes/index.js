var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/profile/:id', function (req, res, next) {
  var id = req.params.id;

  var canUpload = false;
  if (id == req.user._id) {
    canUpload = true
  }

  User.getUserById(id, function (err, currentUser) {
    res.render('profile', {
      canUpload: canUpload,
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