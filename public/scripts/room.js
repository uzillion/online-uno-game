$(function () {
  room_id = parseInt($('#room-id').val());
  var socket = io('/gameroom');
    socket.emit('room created', {room_id: parseInt(room_id)});
});