$(function () {
  $('#play-card').hide();
  room_id = parseInt($('#room-id').val());
  var socket = io('/gameroom');
  socket.emit('room created', {room_id: parseInt(room_id)});

  $('#start-button').on('click', function() {
    $.post("/gameroom/start/"+room_id, function(data) {
      console.log(data);
      $('#play-card').show();          
      $('#start-button').hide();
      // To-Do: Implement placements of players and deck.
    });
  })

  $('#play-card').on('click', function() {
    selectedCard = {symbol: "+2", color: "red", action: null};
    $.post("/gameroom/play/"+room_id, {card: selectedCard}, function(data) {
      // To-Do: Implement placements of players and deck.      
    });
  });
  
  $('#change-color').on('click', function() {
    newColor = "bitchass";
    $.post("/gameroom/change-color/"+room_id, {color: newColor}, function(data) {
      // To-Do: Implement placements of blank color card.      
    });
  });

});