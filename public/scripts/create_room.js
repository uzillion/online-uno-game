$('#create_room').hide();
$(".fa-plus").on("click", function() {
  $('#create_room').animate({
    opacity: 1,
    height: "toggle"
  }, 500, function() {
    // Animation complete.
  });
});

// $('#create_room').on("click", function() {
//   $.post("/gameroom/create");
// })
