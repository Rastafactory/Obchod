var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:Admin567@ds125723.mlab.com:25723/shopin', { useMongoClient: true });

var db = mongoose.connection;

var ProductSchema = mongoose.Schema({
    productname: {
        type: String,
        index: true
    },
    product_id: {
        type: Number
    },
    availability: {
        type: String
    },
    manufacturer: {
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
    img: Array
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

module.exports.removeProduct = function(productId, callback){
    var query = {_id: productId};
    Product.remove(query, callback);
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