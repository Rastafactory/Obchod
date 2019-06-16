var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.connect(config.mongoDBConnectionString, {
    useNewUrlParser: true
});
var db = mongoose.connection;

// Event Schema
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

module.exports = {
    getEventById,
    getAllEvents,
    getMaxEventId,
    createEvent,
    attendOnEvent,
    generateTeamsInEvent,
    finishEvent,
    assignGoalsAndAssists,
    closeEvent,
    cancelEvent
}

function getEventById(id, callback) {
    var query = {
        _id: id
    };
    Event.findOne(query).then(function (result) {
        callback(result)
    }).catch(function (error) {
        console.log(error)
    })
}

function finishEvent(id, score, callback) {
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

function createEvent(newEvent, callback) {
    newEvent.save(callback);
}

function getAllEvents(callback) {
    Event.find().sort({
        event_id: -1
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });
}

function attendOnEvent(id, player, callback) {

    Event.findOneAndUpdate({
        _id: id,
        "players._id": player._id
    }, {
        $set: {
            "players.$": player
        }
    }, function () {
        Event.findOneAndUpdate({
            _id: id
        }, {
            $addToSet: {
                'players': player
            }
        }, callback)
    }).then(function (response) {
        console.log(response)
    }).catch(function () {
        console.log(error)
    })
}

function assignGoalsAndAssists(id, team1, team2, callback) {
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

function getMaxEventId(callback) {
    Event.find().sort({
        event_id: -1
    }).limit(1).then(function (response) {
        callback(response[0].event_id)
    }).catch(function (error) {
        console.log(error)
    });
}

function generateTeamsInEvent(id, team1, team2, callback) {
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

function closeEvent(id, callback) {
    var query = {
        _id: id
    };
    Event.findOneAndUpdate(query, {
        "status": "closed"
    }, {
        new: true
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });;
}

function cancelEvent(id, callback) {
    Event.remove({
        _id: id
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        console.log(error)
    });;
}