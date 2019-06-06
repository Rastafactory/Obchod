var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.connect(config.mongoDBConnectionString, { useNewUrlParser: true });
var db = mongoose.connection;

// User Schema
var EventSchema = mongoose.Schema({
    event_id: {
        type: String,
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
    }
});

var Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.getEventById = function(id, callback){
    var query = {id: id};
    Event.findOne(query, callback);
}

module.exports.createEvent = function(newEvent, callback){
    newEvent.save(callback);
}

module.exports.getAllEvents = function(callback) {
    Event.find(callback);
   }

module.exports.attendOnEvent = function(id, player, callback){
    Event.update({_id: id}, {$addToSet:{'players':player}}, callback);
}