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
    
    Product.find({}).then(products => {
        let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
        products.forEach( (product) => {
            product.formattedPrice = format.format(product.price);
        });
    res.render('index', {
        products: products,
        cart: req.session.cart
    });

  }).catch(err => {
      res.status(400).send('Bad request');
  });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {cart: req.session.cart
  });
});

router.get('/blog', function(req, res, next) {
  res.render('blog', {cart: req.session.cart
  });
});

router.get('/single-blog', function(req, res, next) {
  res.render('single-blog', {cart: req.session.cart
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', {cart: req.session.cart
  });
});

module.exports = router;
