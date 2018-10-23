var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    var a = new Date();
    var date = a.toString().substr(4, 11);
    
    Product.find({}, function(err, products) {
        var productMap = {};

        products.forEach(function(product) {
          productMap[product._id] = product;
        });
        console.log(products);
    
        res.render('index', {
            products: products
        });
    })
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {
  });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', {
  });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', {
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', {
  });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;
