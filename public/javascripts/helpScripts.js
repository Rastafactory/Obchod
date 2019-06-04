$ (function() {
    $("#callapseButton1").on("click", function () {
        $('.collapseExample1').collapse("show");
        $('.collapseExample2, .collapseExample3').collapse("hide");
    });

    $("#callapseButton2").on("click", function () {
        $('.collapseExample2').collapse("show");
        $('.collapseExample1, .collapseExample3').collapse("hide");
    });

    $("#callapseButton3").on("click", function () {
        $('.collapseExample3').collapse("show");
        $('.collapseExample1, .collapseExample2').collapse("hide");
    });

    $('#datetimepicker4').datetimepicker();
});