var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config.js');

mongoose.connect(config.mongoDBConnectionString, {
    useNewUrlParser: true
});

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
    },
    admin: {
        type: Boolean
    },
    summary: {
        type: Object
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = function (callback) {
    User.find({}, {
        firstname: 1,
        lastname: 1,
        email: 1,
        username: 1,
        profileimage: 1,
        summary: 1
    }, callback)
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

module.exports.userFinishedEvent = function (team1, team2, result, callback) {
    if(result=='draw'){
        var allPlayers = team1.concat(team2);
        console.log(allPlayers)
        var query = {
            _id: { $in: allPlayers}
        };

        User.updateMany(query, { $inc: { "summary.gamesplayed": 1, "summary.draws": 1 }}).then(function (data) {
            callback(data)
        }).catch(function (error) {
            console.log(error)
        });
    }

    if(result=='firstTeamWon'){
        User.updateMany({_id: { $in: team1}}, { $inc: { "summary.gamesplayed": 1, "summary.wins": 1 }}).then(function () {
            User.updateMany({_id: { $in: team2}}, { $inc: { "summary.gamesplayed": 1, "summary.losses": 1 }}).then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
            });
        }).catch(function (error) {
            console.log(error)
        });
    }

    if(result=='secondTeamWon'){
        User.updateMany({_id: { $in: team2}}, { $inc: { "summary.gamesplayed": 1, "summary.wins": 1 }}).then(function () {
            User.updateMany({_id: { $in: team1}}, { $inc: { "summary.gamesplayed": 1, "summary.losses": 1 }}).then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
            });
        }).catch(function (error) {
            console.log(error)
        });
    }
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    })
}

module.exports.validateEmailAccessibility = function (email, callback) {
    var query = {
        email: email
    };
    User.findOne(query).then(function (err, result) {
        if (err) {
            console.log(err)
        } else {
            callback(result)
        }
    });
}