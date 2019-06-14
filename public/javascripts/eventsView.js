$(function () {
  $("#callapseButton1").on("click", function () {
    $("#callapseButton1").addClass("active");
    $("#callapseButton2").removeClass("active");
    $("#callapseButton3").removeClass("active");
    $('.collapseExample1').collapse("show");
    $('.collapseExample2, .collapseExample3').collapse("hide");
  });

  $("#callapseButton2").on("click", function () {
    $("#callapseButton2").addClass("active");
    $("#callapseButton1").removeClass("active");
    $("#callapseButton3").removeClass("active");
    $('.collapseExample2').collapse("show");
    $('.collapseExample1, .collapseExample3').collapse("hide");
  });

  $("#callapseButton3").on("click", function () {
    $("#callapseButton3").addClass("active");
    $("#callapseButton1").removeClass("active");
    $("#callapseButton2").removeClass("active");
    $('.collapseExample3').collapse("show");
    $('.collapseExample1, .collapseExample2').collapse("hide");
  });

  $("#createEventForm").submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(this);

    $.ajax({
      type: "POST",
      url: '/events/createEvent',
      data: form.serialize(), // serializes the form's elements.
      success: function (event) {
        alert('Event number: ' + event.event_id + ' has been successfully created.');
        location.reload();
      }
    });
  });
});

function generateTeams(id) {
  $.ajax({
    type: "POST",
    url: "events/generateTeams/" + id,
    success: function (data) {
      console.log(data)
      alert(data);
      location.reload();
    }
  });
}

function submitCancelEvent(eventId) {
  $("#cancelEventDialog").dialog({
    width: "60%",
    title: 'Are you sure you want to cancel this event?',
    buttons: [{
        text: "No",
        icon: "ui-icon-close",
        "class": "btn btn-outline-primary mr-2",
        click: function () {
          $(this).dialog("close");
        }
      },
      {
        text: "Yes",
        icon: "ui-icon-check",
        "class": "btn btn-outline-danger",
        click: function () {
          $.ajax({
            type: "POST",
            url: "events/cancelEvent/" + eventId,
            success: function (data) {
              console.log(data)
              location.reload();
            }
          });
        }
      }
    ]
  });
  var $dialog = $(".ui-dialog");
  $dialog.addClass("modal-content position-fixed");
  $dialog.find(".ui-dialog-titlebar").addClass("modal-header bg-light").find(".ui-button").addClass("close").text("x");
  $dialog.find(".ui-dialog-titlebar").find(".ui-dialog-title").addClass("modal-title h4");
  $dialog.find(".ui-dialog-buttonpane").addClass("modal-footer");
  $dialog.find(".ui-dialog-content").empty();
  $dialog.find(".ui-dialog-content").addClass("modal-body");
  //$dialog.find(".ui-dialog-content").addClass("modal-body").text('test');
}

function submitFinishEvent(eventId) {
  $("#finishEventDialog").dialog({
    width: "60%",
    title: 'What was the score?',
    buttons: [{
        text: "Cancel",
        "class": "btn btn-outline-danger mr-2",
        click: function () {
          $(this).dialog("close");
        }
      },
      {
        text: "Submit",
        "class": "btn btn-outline-primary",
        click: function () {

          var team1=$('#team1').val();
          var team2=$('#team2').val();
          var score={
            team1: team1,
            team2: team2
          };

            $.ajax({
              type: "POST",
              url: "/events/finishEvent/" + eventId,
              dataType: 'json',
              contentType: 'application/json',
              data: JSON.stringify(score), // serializes the form's elements.
              success: function (data) {
                console.log(data.message);
                location.reload();
              },
              error: function(error){
                console.log(error);
              }
            })
          }
      }]
  });
  var $dialog = $(".ui-dialog");
  $dialog.addClass("modal-content position-fixed");
  $dialog.find(".ui-dialog-titlebar").addClass("modal-header bg-light").find(".ui-button").addClass("close").text("x");
  $dialog.find(".ui-dialog-titlebar").find(".ui-dialog-title").addClass("modal-title h4");
  $dialog.find(".ui-dialog-buttonpane").addClass("modal-footer");
  $dialog.find(".ui-dialog-content").addClass("modal-body");
  $dialog.find(".ui-dialog-content").empty();
  $dialog.find(".ui-dialog-content").append('<form id="finishEventForm"><div class="form-row"><div class="form-group col-md-6"><label>Team 1</label><input id="team1" type="number" min=0 class="form-control"></div><div class="form-group col-md-6"><label>Team 2</label><input id="team2" type="number" min=0 class="form-control"></div></div></form>');
}

function attendEvent(eventId) {
  console.log(eventId);
  $.ajax({
    type: "POST",
    url: '/events/attendOnEvent/' + eventId,
    success: function (data) {
      alert(data);
      location.reload();
    }
  });
}