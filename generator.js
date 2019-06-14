module.exports.generateTwoTeams = function (players, number, callback) {
    var team1 = {
        goals: 0,
        players: []
    };
    var team2 = {
        goals: 0,
        players: []
    };

    var index = players.indexOf(player);
    if (index > -1) {
    array.splice(index, 1);
    }

    for (i = 0; i < number; i++) {
        //select random player from array
        var player = players[Math.floor(Math.random()*players.length)];
        var index = players.indexOf(player);
        
        //add player to particular team
        if (i === 0) {
            team1.players.push(players[index])
        }
        else if (i % 2 === 0) {
            team1.players.push(players[index])  
        }
        else {
            team2.players.push(players[index])
        }

        //delete player which has been added to particular team
        if (index > -1) {
            players.splice(index, 1);
        }
    }

    callback(team1, team2)
}