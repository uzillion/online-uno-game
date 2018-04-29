$(function() {
  $('#create-room').hide();
  $(".fa-plus").on("click", function() {
    $('#create-room').animate({
      opacity: 1,
      height: "toggle"
    }, 500, function() {
    // Animation complete.
    });
  });

  var socket = io('/gameroom');
  socket.on('add room button', function(data) {
    if($('#active-rooms').find(`#${data.room_id}`).length === 0) {

      $('#active-rooms').append(`
        <tr id="${data.room_id}">
          <td>Room ${data.room_id}</td><td><a class="btn btn-sm btn-primary" href="/gameroom/join/${data.room_id}">Join</a></td>
        </tr>
      `)
    }
  });
});
