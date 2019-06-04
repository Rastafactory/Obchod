var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config.js');

mongoose.connect(config.mongoDBConnectionString);

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    profileimage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createUser = function(newUser, callback){
        bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
    });
}
)}

module.exports.validateEmailAccessibility = function (email, callback){
    var query = {email: email};
    User.findOne(query).then(function(err, result) {
        if (err) {
            console.log(err)
        }else {
            callback(result)
        }
    });
 }