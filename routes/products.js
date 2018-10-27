var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/uploads'});
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
}).array('img',2);;

router.get('/', function(req, res, next) {
    res.render('products',  {
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
                product: product,
                nonce: Security.md5(req.sessionID + req.headers['user-agent'])
            });
        }     
    }
    )  
});

router.get('/addProduct', function(req, res, next) {
    Product.find({}, {}, function(err, products) {
    var productMap = {};

    products.forEach(function(product) {
      productMap[products._id] = product;
    });
        console.log(products);
    
    
      res.render('addProduct', {products: products
      });
    });
});

router.post('/addProduct', upload, function(req, res, next) {
    var productname = req.body.productname;
    var product_id = req.body.product_id;
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

router.post('/deleteProduct/:id', function(req, res, next) {
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
