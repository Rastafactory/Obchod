$(function () {
  console.log('event');

  $("#addToCartForm").submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(this);

    $.ajax({
      type: "POST",
      url: '/cart',
      data: form.serialize(), // serializes the form's elements.
      success: function (event) {
        console.log(event);
        alert(event);
        location.reload();
      }
    });
  });

});

