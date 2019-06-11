var mongoose = require('mongoose');
var config = require('../config.js');
var User = require('./user.js');

mongoose.connect(config.mongoDBConnectionString, {
    useNewUrlParser: true
});
var db = mongoose.connection;

// User Schema
var EventSchema = mongoose.Schema({
    event_id: {
        type: Number,
        index: true
    },
    owner: {
        type: String
    },
    place: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    description: {
        type: String
    },
    players: {
        type: Array
    },
    status: {
        type: String
    },
    team1: {
        type: Object
    },
    team2: {
        type: Object
    }
});

var Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.getEventById = function (id, callback) {
    var query = {
        _id: id
    };
    Event.findOne(query, callback);
}

module.exports.getEventByIdAndFetchPlayers = function (id, callback) {
    var query = {
        _id: id
    };
    Event.findOne(query).then(function (response) {
        var players = []
        for (i = 0; i < response.players.length; i++) {
            players.push(response.players[i]._id)
        }

        User.find({
            _id: {
                $in: players
            }
        }).then(function (response) {
            callback(response)
        }).catch(function (error) {
            console.log(error)
        });
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports.createEvent = function (newEvent, callback) {
    newEvent.save(callback);
}

module.exports.getAllEvents = function (callback) {
    Event.find().sort({
        event_id: -1
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports.attendOnEvent = function (id, player, callback) {
    Event.update({
        _id: id
    }, {
        $addToSet: {
            'players': player
        }
    }, callback);
}

module.exports.getMaxEventId = function (callback) {
    Event.find().sort({
        event_id: -1
    }).limit(1).then(function (response) {
        callback(response[0].event_id)
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports.generateTeamsInEvent = function (id, team1, team2, callback) {
    var query = {
        _id: id
    };
    var update = {
        status: 'started',
        team1: team1,
        team2: team2
    }
    Event.update(query, update, callback);
}

module.exports.cancelEvent = function (id, callback) {
    Event.remove({
        _id: id
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });;
}