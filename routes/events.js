var express = require('express');
var router = express.Router();
var Event = require('../models/event');
let date = require('date-and-time');

router.get('/', function(req, res, next) {

    var owner = req.user._id;
    var admin = req.user.admin;
    console.log(owner)

    Event.getAllEvents(function(err, events) {
        if(err) throw err;

        var currentEvents = [];
        var finishedEvents = [];
        for(var i = 0; i < events.length; i++) {
            if (events[i].status == 'new') {
                currentEvents.push(events[i]);
            }else if(events[i].status == 'finished'){
                finishedEvents.push(events[i]);
            }else{
                console.log('another status.')
            }
        }

        res.render('events', {
            admin: admin,
            owner: owner,
            currentEvents: currentEvents,
            finishedEvents: finishedEvents            
        });
    });
});

router.post('/createEvent', function(req, res, next) {

    var event_id = Math.floor(Math.random()*900000) + 100000;
    var players = [];
    players.push(req.user);

    let now = new Date(req.body.date);

    var newEvent = new Event({
        event_id: event_id,
        owner: req.user._id,
        place: req.body.place,
        date: date.format(now, 'DD/MMMM/YYYY'),
        time: req.body.time,
        description: req.body.description,
        players: players,
        status: 'new'
    });

    Event.createEvent(newEvent, function(err, event) {
        if(err) throw err;
        res.send(event);
    });
});

/*router.post('/cancelEvent/:id', function(req, res, next) {

    var id = req.params.id;
    console.log(id);

    Event.cancelEvent(id, function(err, event) {
        if(err) throw err;
        res.send('Event has been canceled.');
    });
});*/

router.post('/attendOnEvent/:id', function(req, res, next) {

    var id = req.params.id,
        player = req.user;

    Event.attendOnEvent(id, player, function(err, event) {
        if(err){
            console.log(err)
            res.send('Unable to participate on event.');
        }else{
            res.send(player);
        }
    });
});

module.exports = router;