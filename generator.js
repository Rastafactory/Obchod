module.exports.generateTwoTeams = function (players, callback) {
    console.log(players)
    var team1 = {
        goals: 0,
        players: []
    };
    var team2 = {
        goals: 0,
        players: []
    };

    for (i = 0; i < players.length; i++) {
        team1.players.push(players[i])
        team2.players.push(players[i])
    }

    callback(team1, team2)
}