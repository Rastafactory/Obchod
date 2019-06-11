$ (function() {
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

    $("#createEventForm").submit(function(e) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var form = $(this);
        
        $.ajax({
               type: "POST",
               url: '/events/createEvent',
               data: form.serialize(), // serializes the form's elements.
               success: function(event)
               {
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
        success: function(data){
            console.log(data)
            alert(data);
            location.reload();
        }
      });
} 

function submitCancelEvent(eventId) {
  $( "#dialog" ).dialog({
    width: "60%",
    title: 'Are you sure you want to cancel this event?',
    buttons: [
      {
        text: "No",
        icon: "ui-icon-close",
        "class": "btn btn-outline-primary mr-2",
        click: function() {
          $( this ).dialog( "close" );
        }
      },
      {
        text: "Yes",
        icon: "ui-icon-check",
        "class": "btn btn-outline-danger",
        click: function() {
          $.ajax({
            type: "POST",
            url: "events/cancelEvent/" + eventId,
            success: function(data){
                console.log(data)
                location.reload();
            }
          });
        }
      }
    ]
  });
    var $dialog = $(".ui-dialog");
    $dialog.addClass("modal-content");
    $dialog.find(".ui-dialog-titlebar").addClass("modal-header bg-light").find(".ui-button").addClass("close").text("x");
    $dialog.find(".ui-dialog-titlebar").find(".ui-dialog-title").addClass("modal-title h4");
    $dialog.find(".ui-dialog-buttonpane").addClass("modal-footer");
    $dialog.find(".ui-dialog-content").addClass("modal-body");
    //$dialog.find(".ui-dialog-content").addClass("modal-body").text('test');
}

function submitFinishEvent() {
    console.log('submitFinishEventButton');
}

function attendEvent(eventId) {
    console.log(eventId);
    $.ajax({
        type: "POST",
        url: '/events/attendOnEvent/' + eventId,
        success: function(data)
        {
             alert(data);
             location.reload();
        }
      });
}