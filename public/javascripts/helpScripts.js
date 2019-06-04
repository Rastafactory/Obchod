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

    $('#datetimepicker4').datetimepicker();
});