$(function () {

  $('#play-card').hide();
  roomId = parseInt($('#room-id').val());
  userId = parseInt($('#user-id').val());

  //=================== SOCKET CONNECTIONS ====================
  var socket = io.connect('/gameroom', {query: `id=${roomId}`});
  
  // Room Created signal
  socket.emit('room created', {room_id: parseInt(roomId)});

  // Start Game
  $('#start-button').on('click', function() {
    socket.emit('start game', {room_id: roomId, user_id: userId});
    // socket.emit('get hand', {user_id: userId, room_id: roomId});
    $('#play-card').show();          
    $('#start-button').hide();
  });

  // Play a card
  $('#my-hand').on('dblclick', function(event) {
    let card = event.target.id.split('_');
    selectedCard = {
      symbol: card[1],
      color: card[0]
    }
    console.log(event.target.id);
    $(`#${event.target.id}`).remove();
    // console.log(selectedCard);
    // socket.emit('play card', {room_id: roomId, user_id: userId, card: selectedCard})
  });

  socket.on('hand', function(data) {
    if(data.user_id == userId) {
      console.log(data.hand);
      $('#my-hand').html('');
      data.hand.hand.forEach((card) => {
        $('#my-hand').append(`
          <img id="${card.color}_${card.symbol}" src="/images/${card.color}_${card.symbol}.png">
        `);
      });
    } else {
      if($('#opponent-1').html() == "") {
        $(`#opponent-1`).html(`
          <img src="/images/card_back_alt.png">
			    <p>Player ${data.turn_number}: ${data.hand.hand.length} cards</p>
        `)  
      } else if($('#opponent-2').html() == "") {
        $(`#opponent-2`).html(`
          <img src="/images/card_back_alt.png">
			    <p>Player ${data.turn_number}: ${data.hand.hand.length} cards</p>
        `)
      } else {
        $(`#opponent-3`).html(`
          <img src="/images/card_back_alt.png">
			    <p>Player ${data.turn_number}: ${data.hand.hand.length} cards</p>
        `)
      }
    }
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
    console.log("New current card hit");
    $('#deck-container').html(`
      <img id="draw-deck" src="/images/card_back_alt.png">
      <img id="play-deck" src="/images/${data.current_card.color}_${data.current_card.symbol}.png">
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