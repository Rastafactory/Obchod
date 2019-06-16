var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config.js');
var Event = require('./event');

mongoose.connect(config.mongoDBConnectionString, {
    useNewUrlParser: true
});

var db = mongoose.connection;

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

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    uploadUserPhoto,
    submitGoalsAndAssists,
    userFinishedEvent,
    comparePassword,
    createUser
}

function getAllUsers(callback) {
    User.find({}, {
        firstname: 1,
        lastname: 1,
        email: 1,
        username: 1,
        profileimage: 1,
        summary: 1
    }, callback)
}

function getUserById(id, callback) {
    User.findById(id, callback);
}

function getUserByUsername(username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

function uploadUserPhoto(id, profileimage, callback) {
    User.updateOne({
        _id: id
    }, {
        $set: {
            profileimage: profileimage
        }
    }).then(function (result) {
        callback(result)
    }).catch(function (error) {
        console.log(error)
    })
}

function submitGoalsAndAssists(eventId, players, callback) {
    var bulk = User.collection.initializeUnorderedBulkOp();

    for (i = 0; i < players.length; i++) {
        bulk.find({
            _id: players[i]._id
        }).update({
            $inc: {
                "summary.goals": players[i].goals,
                "summary.assists": players[i].assists
            }
        });
    }
    bulk.execute().then(function (result) {
        console.log(result)
        Event.closeEvent(eventId, function () {
            callback()
        })
    }).catch(function (error) {
        console.log(error)
    });
}

function userFinishedEvent(team1, team2, result, callback) {
    if (result == 'draw') {
        var allPlayers = team1.concat(team2);
        console.log(allPlayers)
        var query = {
            _id: {
                $in: allPlayers
            }
        };

        User.updateMany(query, {
            $inc: {
                "summary.gamesplayed": 1,
                "summary.draws": 1
            }
        }).then(function (data) {
            callback(data)
        }).catch(function (error) {
            console.log(error)
        });
    }

    if (result == 'firstTeamWon') {
        User.updateMany({
            _id: {
                $in: team1
            }
        }, {
            $inc: {
                "summary.gamesplayed": 1,
                "summary.wins": 1
            }
        }).then(function () {
            User.updateMany({
                _id: {
                    $in: team2
                }
            }, {
                $inc: {
                    "summary.gamesplayed": 1,
                    "summary.losses": 1
                }
            }).then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
            });
        }).catch(function (error) {
            console.log(error)
        });
    }

    if (result == 'secondTeamWon') {
        User.updateMany({
            _id: {
                $in: team2
            }
        }, {
            $inc: {
                "summary.gamesplayed": 1,
                "summary.wins": 1
            }
        }).then(function () {
            User.updateMany({
                _id: {
                    $in: team1
                }
            }, {
                $inc: {
                    "summary.gamesplayed": 1,
                    "summary.losses": 1
                }
            }).then(function (data) {
                callback(data)
            }).catch(function (error) {
                console.log(error)
            });
        }).catch(function (error) {
            console.log(error)
        });
    }
}

function comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        callback(null, isMatch);
    });
}

function createUser(newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save().then(function (result) {
                callback('good')
            }).catch(function (error) {
                console.log(error)
                callback('bad')
            });;
        });
    })
}