var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Football Factory' });
});

router.get('/profile', function(req, res, next) {
  var user=req.user;
  console.log(user);
  res.render('profile', { title: 'Football Factory' });
});

router.get('/stats', function(req, res, next) {
  res.render('stats', { title: 'Football Factory' });
});


module.exports = router;