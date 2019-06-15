var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var User = require('../models/user');
let date = require('date-and-time');
var generator = require('../generator');

router.get('/', function (req, res, next) {

    var loggedUser = {
        _id: req.user._id,
        username: req.user.username,
        profileimage: req.user.profileimage
    }
    var admin = req.user.admin;

    Event.getAllEvents(function (events) {
        var currentEvents = [];
        var finishedEvents = [];
        for (var i = 0; i < events.length; i++) {
            if (events[i].status == 'new' || events[i].status == 'started') {
                currentEvents.push(events[i]);
            } else if (events[i].status == 'finished') {
                finishedEvents.push(events[i]);
            } else {
                console.log('another status.')
            }
        }

        res.render('events', {
            admin: admin,
            loggedUser: loggedUser,
            currentEvents: currentEvents,
            finishedEvents: finishedEvents
        });
    });
});

router.post('/assignGoalsAndAssists/:id', function (req, res, next) {
    var id = req.params.id;
    var data = req.body;
    console.log(data);

    Event.getEventById(id, function (event) {
        var team1 = event.team1;
        var team2 = event.team2;
        if (data.team == 'team1') {
            team1.players[data.playerId].goals = Number(data.goals)
            team1.players[data.playerId].assists = Number(data.assists)
        } else if (data.team == 'team2') {
            team2.players[data.playerId].goals = Number(data.goals)
            team2.players[data.playerId].assists = Number(data.assists)
        }

        Event.assignGoalsAndAssists(id, team1, team2, function () {
            res.send({message: 'Goals and assists have been assigned.'});
        })
    })
});

router.post('/createEvent', function (req, res, next) {
    var players = [];
    var player = {
        _id: req.user._id,
        username: req.user.username,
        profileimage: req.user.profileimage,
        summary: req.user.summary,
        goals: 0,
        assists: 0
    }

    players.push(player);
    let now = new Date(req.body.date);

    Event.getMaxEventId(function (maxId) {

        var newEvent = new Event({
            event_id: maxId + 1,
            owner: req.user._id,
            place: req.body.place,
            date: date.format(now, 'DD/MMMM/YYYY'),
            time: req.body.time,
            description: req.body.description,
            players: players,
            status: 'new',
            team1: {
                goals: 0,
                players: []
            },
            team2: {
                goals: 0,
                players: []
            }
        });
        Event.createEvent(newEvent, function (err, event) {
            if (err) throw err;
            res.send(event);
        });
    })

});



router.post('/generateTeams/:id', function (req, res, next) {
    var id = req.params.id;

    Event.getEventById(id, function (event) {
        generator.generateTwoTeams(event.players, event.players.length, function (team1, team2) {
            Event.generateTeamsInEvent(id, team1, team2, function (err, data) {
                if (err) {
                    console.log(err)
                    res.send('Unable to generate teams.');
                } else {
                    res.send('Teams are ready. Enjoy the game!');
                }
            })
        })
    })
});

router.get('/finishedEvent/:id', function (req, res, next) {
    var id = req.params.id;
    var loggedUser = {
        _id: req.user._id,
        username: req.user.username,
        profileimage: req.user.profileimage,
        admin: req.user.admin
    }

    Event.getEventById(id, function (result) {
        if (result.status == 'finished') {
            var event = result;
        } else {
            console.log('another status.')
        }

        res.render('finishedEvent', {
            event: event,
            loggedUser: loggedUser
        });
    })
});

router.post('/finishEvent/:id', function (req, res, next) {
    var id = req.params.id;
    var score = req.body;
    console.log(score);

    Event.finishEvent(id, score, function (response) {
        var team1 = [];
        var team2 = [];
        for (i = 0; i < response.team1.players.length; i++) {
            team1.push(response.team1.players[i]._id)
        }
        for (i = 0; i < response.team1.players.length; i++) {
            team2.push(response.team2.players[i]._id)
        }

        if (response.team1.goals == response.team2.goals) {
            User.userFinishedEvent(team1, team2, 'draw', function () {
                console.log('It was a draw.');
                res.send({
                    message: 'It was a draw.'
                });

            })
        } else if (response.team1.goals > response.team2.goals) {
            User.userFinishedEvent(team1, team2, 'firstTeamWon', function () {
                console.log('First team has won.');
                res.send({
                    message: 'First team has won.'
                })
            })
        } else if (response.team1.goals < response.team2.goals) {
            User.userFinishedEvent(team1, team2, 'secondTeamWon', function () {
                console.log('Second team has won.');
                res.send({
                    message: 'Second team has won.'
                })
            })
        } else {
            console.log('Unable to compare score.');
            res.send({
                message: 'Unable to compare score.'
            })
        }
    })
});

router.get('/submitGoalsAndAssists/:id', function (req, res, next) {
    var id = req.params.id;
    var loggedUser = {
        _id: req.user._id,
        username: req.user.username,
        profileimage: req.user.profileimage,
        admin: req.user.admin
    }
    console.log(id);

    Event.getEventById(id, function (event) {
        res.send({message: 'Goals and assists have been submitted.'});
    })
});

router.post('/cancelEvent/:id', function (req, res, next) {
    var id = req.params.id;

    Event.cancelEvent(id, function (response) {
        res.send(response);
    });
});

router.post('/attendOnEvent/:id', function (req, res, next) {

    var id = req.params.id;
    var player = {
        _id: req.user._id,
        username: req.user.username,
        profileimage: req.user.profileimage,
        summary: req.user.summary,
        goals: 0,
        assists: 0
    }

    Event.attendOnEvent(id, player, function (err, event) {
        if (err) {
            console.log(err)
            res.send('Unable to participate on event.');
        } else {
            res.send('Well done! You will participate on this event.');
        }
    });
});

module.exports = router;