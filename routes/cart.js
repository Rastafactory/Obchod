var express = require('express');
var router = express.Router();
var Cart = require('../lib/Cart');
var Security = require('../lib/Security');
var Product = require('../models/product');

router.get('/', function(req, res) {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('cart', {
        cart: cart,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });
});

router.get('/remove/:id/:nonce', (req, res) => {

   let id = req.params.id;
   if(/^\d+$/.test(id) && Security.isValidNonce(req.params.nonce, req)) {
       Cart.removeFromCart(parseInt(id, 10), req.session.cart);
       res.redirect('back');
   } else {
       res.redirect('/');
   }
});

router.get('/empty/:nonce', (req, res) => {
    if(Security.isValidNonce(req.params.nonce, req)) {
        Cart.emptyCart(req);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
});

router.post('/', function(req, res) {
    if(req.err){
        console.log(req.err);
    }
    let qty = parseInt(req.body.qty, 10);
    let product = parseInt(req.body.product_id, 10);
    if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
        Product.findOne({product_id: product}).then(prod => {
            let cart = (req.session.cart) ? req.session.cart : null;
            Cart.addToCart(prod, qty, cart);
            res.redirect('back');
        }).catch(err => {
           res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

router.post('/update', (req, res) => {
    let ids = req.body["product_id[]"];
    let qtys = req.body["qty[]"];
    if(Security.isValidNonce(req.body.nonce, req)) {
        let cart = (req.session.cart) ? req.session.cart : null;
        let i = (!Array.isArray(ids)) ? [ids] : ids;
        let q = (!Array.isArray(qtys)) ? [qtys] : qtys;
        Cart.updateCart(i, q, cart);
        res.redirect('/cart');
    } else {
        res.redirect('/');
    }
});

module.exports = router;
