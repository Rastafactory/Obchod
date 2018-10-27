var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');
var Security = require('../lib/Security');

router.get('/', function(req, res, next) {
    if(!req.session.cart) {
      req.session.cart = {
          items: [],
          totals: 0.00,
          formattedTotals: ''
      };
    }  
    Product.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
        let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
        products.forEach( (product) => {
            product.formattedPrice = format.format(product.price);
        });
    res.render('index', {
        products: products,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });

  }).catch(err => {
      res.status(400).send('Bad request');
  });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {
  });
});

router.get('/blog', function(req, res, next) {
  res.render('blog', {
  });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;
