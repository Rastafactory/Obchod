var express = require('express');
var router = express.Router();
var User = require('../models/user');
const Security = require('../lib/Security');

router.get('/', (req, res) => {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    res.render('checkout', {
        pageTitle: 'Checkout',
        cart: cart,
        checkoutDone: false,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });
});

router.post('/', (req, res) => {
    let sess = req.session;
    let cart = (typeof sess.cart !== 'undefined') ? sess.cart : false;
    if(Security.isValidNonce(req.body.nonce, req)) {
        res.render('checkout', {
            pageTitle: 'Checkout',
            cart: cart,
            checkoutDone: true
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
