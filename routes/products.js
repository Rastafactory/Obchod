var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/uploads'});
var LocalStrategy = require('passport-local');

var Product = require('../models/product');

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
});

router.get('/', function(req, res, next) {
    res.render('products',  {
    });
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

router.post('/addProduct', upload.any('img'), function(req, res, next) {
    var productname = req.body.productname;
    var productcode = req.body.productcode;
    var availability = req.body.availability;
    var brand = req.body.brand;
    var category = req.body.category;
    var subcategory = req.body.subcategory;
    var description = req.body.description;
    var price = req.body.price;
    
    if(req.files){
        console.log('Uploading File...');
        var path = req.files[0].path;
        var imageName = req.files[0].originalname;
    }else{
        console.log('No File Uploaded...');
        var path = 'uploads\\noimage.jpg';
        var imageName = 'noimage.jpg';
    }
    
    // Form Validator
    //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    //Check Errors
    var errors = req.validationErrors();
    

    var imagepath = {};
    imagepath['path'] = path;
    imagepath['originalname'] = imageName;
    
    if(errors){
        console.log(errors);
        res.render('addProduct',{
            errors: errors            
        });
    }else{
        var newProduct = new Product({
            productname: productname,
            productcode: productcode,
            availability: availability,
            brand: brand,
            category: category,
            subcategory: subcategory,
            description: description,
            price: price,
            img: imagepath
        });
        
        Product.createProduct(newProduct, function(err, product){
            if(err) throw err;
            console.log(product);
        });
        
        req.flash('success', 'Product was added into database');
        
        res.location('/products/addProduct');
        res.redirect('/products/addProduct');
    }
});

module.exports = router;
