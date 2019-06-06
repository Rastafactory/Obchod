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

function submitCancelEvent() {
    console.log('submitCancelEventButton');
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