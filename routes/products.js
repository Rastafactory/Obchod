var express = require('express');
var router = express.Router();
var multer = require('multer');
var LocalStrategy = require('passport-local');

var Product = require('../models/product');
var Security = require('../lib/Security');

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, './public/uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
}).array('img',5);;

router.get('/', function(req, res, next) {
    Product.find({price: {'$gt': 0}}).sort({price: -1}).limit(6).then(products => {
        let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
        products.forEach( (product) => {
            product.formattedPrice = format.format(product.price);
        });
    res.render('products', {
        cart: req.session.cart,
        products: products,
        nonce: Security.md5(req.sessionID + req.headers['user-agent'])
    });

  }).catch(err => {
      res.status(400).send('Bad request');
  });
});

router.get('/product_detail/:id', function(req, res, next) {
    var pruductID = req.params.id;
    
    
    Product.getProductById(pruductID, function(err, product) {
        if(err){
            res.render('addProduct', {errors: err});
        }else{
            let format = new Intl.NumberFormat(req.app.locals.locale.lang, {style: 'currency', currency: req.app.locals.locale.currency });
            product.formattedPrice = format.format(product.price);
            res.render('product_detail', 
            {
                cart: req.session.cart,
                product: product,
                nonce: Security.md5(req.sessionID + req.headers['user-agent'])
            });
        }     
    }
    )  
});

router.get('/addProduct', Security.ensureAuthenticated, function(req, res, next) {
    Product.find({}, {}, function(err, products) {
    var productMap = {};

    products.forEach(function(product) {
      productMap[products._id] = product;
    });
        console.log(products);
    
    
      res.render('addProduct', {products: products, cart: req.session.cart
      });
    });
});

router.post('/addProduct', Security.ensureAuthenticated, upload, function(req, res, next) {
    var productname = req.body.productname;
    var availability = req.body.availability;
    var manufacturer = req.body.manufacturer;
    var category = req.body.category;
    var subcategory = req.body.subcategory;
    var description = req.body.description;
    var price = req.body.price;
    var imageName = [];
    
    if(req.files){
        console.log('Uploading File...');
        
        for(var i=0; i<req.files.length;i++){
        var originalname = req.files[i].originalname;
        imageName.push(originalname);
        }
        
    }else{
        console.log('No File Uploaded...');
        var imageName = 'noimage.jpg';
    }
    
    var product_id = Math.floor(Math.random()*900000) + 100000;
    
        var newProduct = new Product({
            productname: productname,
            product_id: product_id,
            availability: availability,
            manufacturer: manufacturer,
            category: category,
            subcategory: subcategory,
            description: description,
            price: price,
            img: imageName
        });
        
        Product.createProduct(newProduct, function(err, product){
            if(err) throw err;
            console.log(product);
        });
        
        req.flash('success', 'Product was added into database');
        
        res.location('/products/addProduct');
        res.redirect('/products/addProduct');
});

router.post('/deleteProduct/:id', Security.ensureAuthenticated, function(req, res, next) {
    var id = req.params.id;
    console.log('Product deleted' + id);
    Product.removeProduct(id, function(err, callback){
        if(err) throw err;
        console.log(callback);
    });
    
    res.location('/products/addProduct');
    res.redirect('/products/addProduct');
    });

module.exports = router;
