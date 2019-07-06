var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config.js');

mongoose.connect(config.mongoDBConnectionString, {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true)

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    admin: {
        type: Boolean
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
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
})
}

module.exports.getUserByEmail = function(email, callback) {
    var query = {
        email: email
    };
    User.findOne(query, callback);
}

module.exports.saveUpdatedUser = function(user, callback) {
    user.save().then(function (err) {
        console.log(err)
        callback(err)
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports.findUserByToken = function(resetPasswordToken, resetPasswordExpires, callback) {
    var query = {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: {
            $gt: resetPasswordExpires
        }
    };
    User.findOne(query, callback);
}

module.exports.saveUpdatedUserPassword = function(user, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            user.save().then(function (err) {
                console.log(err)
                callback(err)
            }).catch(function (error) {
                console.log(error)
            });
        });
    })
}