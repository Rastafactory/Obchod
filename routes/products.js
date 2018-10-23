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
            res.render('product_detail', {product: product });
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
    var productcode = req.body.productcode;
    var availability = req.body.availability;
    var brand = req.body.brand;
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
            productcode: productcode,
            availability: availability,
            brand: brand,
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
