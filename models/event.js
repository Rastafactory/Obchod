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
    Event.findOne(query).then(function (result) {
        callback(result)
    }).catch(function (error) {
        console.log(error)
    })
}

module.exports.finishEvent = function (id, score, callback) {
    var query = {
        _id: id
    };
    Event.findOneAndUpdate(query, {
        $set: {
            'team1.goals': Number(score.team1),
            'team2.goals': Number(score.team2)
        },
        "status": "finished"
    }, {
        new: true
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });;
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



module.exports.assignGoalsAndAssists = function (id, team1, team2, callback) {
    console.log(team1)
    console.log(team2)
    Event.update({
        _id: id
    }, {
        $set: {
            'team1': team1,
            'team2': team2
        }
    }).then(function (response) {
        callback()
    }).catch(function (error) {
        console.log(error)
    });
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