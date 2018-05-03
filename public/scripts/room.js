$(function () {
  $('#play-card').hide();
  roomId = parseInt($('#room-id').val());
  userId = parseInt($('#user-id').val());

  //=================== SOCKET CONNECTIONS ====================
  var socket = io('/gameroom');
  
  // Room Created signal
  socket.emit('room created', {room_id: parseInt(roomId)});

  // Start Game
  $('#start-button').on('click', function() {
    socket.emit('start game', {room_id: roomId, user_id: userId});
    socket.emit('get hand', {user_id: userId, room_id: roomId});
    $('#play-card').show();          
    $('#start-button').hide();
  });

  // Play a card
  $('#play-card').on('dblclick', function(event) {
    let card = event.target.id.split('_');
    selectedCard = {
      symbol: card[1],
      color: card[0]
    }
    socket.emit('play card', {room_id: roomId, user_id: userId, card: selectedCard})
  });

  socket.on('hand', function(hand) {
    console.log(hand);
  });

  // Next Turn
  socket.on('active turn', function(data) {
    if(data.user_id == userId) {
      $('#turn-indicator').show();
    } else {
      $('#turn-indicator').hide();        
    }
  });

  // Update current card
  socket.on('new current card', function(data) {
    $('#current-card').html(`
      <h6 style="color: red">${data.current_card}</h6>
    `)
  });

  socket.on('error', function(data) {
    let error_message;
    if(data.error == 'invalid') {
      error_message = "Sorry, that's an invalid card to play"
    } else if(data.error == 'outofturn') {
      error_message = "Sorry, you cannot play this card on other's turn"
    }
    $('#error').html(`
      <div class="alert alert-danger show fade center">
        ${error_message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  });

  // Change Color
  $('#change-color').on('click', function(event) {
    let newColor = event.target.id;
    socket.emit('change color', {room_id: roomId, color: newColor});
  });
  //============================================================
  

});