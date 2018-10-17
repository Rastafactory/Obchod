var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:Admin567@ds125723.mlab.com:25723/shopin', { useMongoClient: true });

var db = mongoose.connection;

/*var imageSchema = new Schema({
img: { data: Buffer, contentType: String }
});

var productSchema = new Schema({
img: [imageSchema];
});*/

var ProductSchema = mongoose.Schema({
    productname: {
        type: String,
        index: true
    },
    productcode: {
        type: String
    },
    availability: {
        type: String
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    subcategory: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    },
    img: { 
        //data: Buffer, contentType: String 
        path: {
                 type: String,
                 required: true,
                 trim: true
                 },
                 originalname: {
                 type: String,
                 required: true
                 }
    }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function(id, callback){
    Product.findById(id, callback);
}


module.exports.getProductByProductName = function(productname, callback){
    var query = {productname: productname};
    Product.findOne(query, callback);
}

module.exports.createProduct = function(newProduct, callback){
            newProduct.save(callback);
}

module.exports.getAllProducts = function(callback, limit) {
 Product.find(callback).limit(limit);
}

/*module.exports.getProductByQuerry = function(productname, callback){
    var query = {productname: productname};
    Product.findOne(query, callback);
}

User.find({}, { email: 1, username: 1, firstname:1, lastname:1 }, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });
        console.log(users);
    
  res.render('index', {
      date: date,
      users: users
  });
});*/