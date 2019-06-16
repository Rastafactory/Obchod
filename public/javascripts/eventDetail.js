  function assignGoalsAndAssists(playerId, team, eventId) {

    if (team == 'team1') {
      var goals = $('#goals1_' + playerId).val();
      var assists = $('#assists1_' + playerId).val();
    } else if (team == 'team2') {
      var goals = $('#goals2_' + playerId).val();
      var assists = $('#assists2_' + playerId).val();
    }

    var data = {
      playerId: playerId - 1,
      goals: goals,
      assists: assists,
      team: team
    };

    $.ajax({
      type: "POST",
      url: "/events/assignGoalsAndAssists/" + eventId,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data) {
        $("input").prop('disabled', true)
      },
      error: function (error) {
        console.log(error)
      }
    });
  }

  function submitGoalsAndAssists(eventId) {

    $.ajax({
      type: "GET",
      url: "/events/submitGoalsAndAssists/" + eventId,
      data: eventId,
      success: function (data) {
        location.reload();
      },
      error: function (error) {
        console.log(error)
      }
    });
  }