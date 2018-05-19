$(function () {

  // Playing instructions
  $('#message').html(`
  <div class="alert alert-info show fade">
    <strong>How to play?</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    <ul>
      <li>Only the creator of gameroom can start the game</li>
      <li>Double click on a card in your hand to play that card</li>
      <li>Wildcards can be played on anyone's turn</li>
      <li>To change to a desired color after playing wildcard, single click on a card with your desired color</li>
      <li>Hover around opponent's card to view how many cards they have</li>
      <li><a target="_blank" href="https://www.youtube.com/watch?v=dicgjskLVJc">Click here to learn the rules</a></li>
    </ul>
  </div>
`);


  let roomId = parseInt($('#room-id').val());
  let userId = parseInt($('#user-id').val());
  let username = $('#username').val();

  // Updating number of cards for opponents
  const updateNcards = (user_id, change) => {
    let old_val = parseInt($(`#${user_id}`).text());
    $(`#${user_id}`).html(`${old_val+change}`);
    let uno_user = $(`#${user_id}`).parent().parent().parent().find('img');

    // If opponent has only 1 card remaining and hasn't called Uno
    if(old_val + change == 1 && !uno_user.hasClass('safe')) {
      uno_user.addClass('danger');
    }  
    else // If opponent has more than 1 card
      uno_user.removeClass('danger');
      if(old_val + change > 1)
        uno_user.removeClass('safe');
  }

  //=================== SOCKET CONNECTIONS ====================
  var socket = io.connect('/gameroom', {query: `id=${roomId}`});
  
  // Room Created signal
  socket.emit('joined room', {room_id: roomId, username: username});

  socket.on('player joined', (data) => {
    if(data.joinedPlayer != username)
      $('#messages').append('<li class="center" style="color: red"><strong>' + data.joinedPlayer + '</strong> joined the room.</li>');
  });

  // Start Game
  $('#start-button').on('click', function() {
    socket.emit('start game', {room_id: roomId, user_id: userId});
  });

  socket.on('game started', function() {
    $('#start-button').hide();
  });

  // Play a card
  $('#my-hand').on('dblclick', function(event) {
    let card = event.target.id.split('_');
    selectedCard = {
      symbol: card[1],
      color: card[0]
    }
    socket.emit('play card', {username: username, user_id: userId, room_id: roomId, card: selectedCard});
  });

  // When user clicks on draw card button
  $('#draw-card').on('click', function() {
    socket.emit('draw card', {user_id: userId, room_id: roomId});
  });

  // When user clicks on pass button
  $('#pass-turn').on('click', function() {
    if($('#draw-card').prop('disabled'))
      socket.emit('pass turn', {room_id: roomId, user_id: userId});
    else {
      $('#error').html(`
        <div class="alert alert-danger show fade center">
          Please draw a card first.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `);
    }
  });

  // Disabling and enabling pass and draw functions for users depending on whose turn it is
  socket.on('change turn', (data) => {
    if(data.user_id != userId) {
      $('#draw-card').prop('disabled', true);
      $('#pass-trun').prop('disabled', true);      
    } else {
      $('#draw-card').prop('disabled', false);
      $('#pass-trun').prop('disabled', false); 
    }
    $('#turn-indicator').html(`<h6 class="center" style="color:red"><strong>${data.username}'s turn</strong></h4>`);
  });

  // When user wants to catch a player
  $('#catch').on('click', () => {

    // Instructions to catch an opponent
    $('#error').html(`
    <div class="alert alert-info show fade center">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <p style="color: #0c5460;">Click on the opponent that you want to catch.</p>
      <p style="color: #0c5460;">If opponent did not call uno, they will have red border, else they will have green border.</p>
    </div>
  `);
    let uno_users = $('.danger');
    uno_users.css('cursor', 'pointer');
    uno_users.on('click', (event) => {
      let uno_user_id = $(`#${event.target.id}`).parent().find('p > span > span').attr('id');
      socket.emit('caught', {user_id: uno_user_id, room_id: roomId});   
      uno_users.css('cursor', 'default');
      uno_users.off('click'); 
    });
  });

  // If user calls uno
  $('#uno').click(function() {
    socket.emit('check uno', {user_id: userId, room_id: roomId});
  });

  // After uno call is verified to be valid
  socket.on('uno called', (data) => {
    let uno_user = $(`#${data.user_id}`).parent().parent().parent().find('img');
    uno_user.removeClass('danger');    
    uno_user.addClass('safe');
  });

  // Updating hand after card is drawn
  socket.on('card drawn', (data) => {
    if(data.room_id = roomId) {
      if(data.user_id == userId) {
        $('#draw-card').prop('disabled', true);    
        let position = parseInt($('#my-hand img').last().css('left'));
        $('#my-hand').append(`
          <img style="position: absolute; left: ${position+60}px" id="${data.card.color}_${data.card.symbol}" src="/images/${data.card.color}_${data.card.symbol}.png">
        `);
      } else {
        updateNcards(data.user_id, 1);
      }
    }
  });

  // Add new cards to hand
  socket.on('add cards', (data) => {
    if(data.room_id == roomId) {
      if(data.user_id ==  userId) {
        data.cards.forEach((card) => {
          let position = parseInt($('#my-hand img').last().css('left'));
          $('#my-hand').append(`
            <img style="position: absolute; left: ${position+60}px" id="${card.color}_${card.symbol}" src="/images/${card.color}_${card.symbol}.png">
          `);
        });
      } else {
        updateNcards(data.user_id, data.cards.length);
      }
    }
  });


  // Drawing hands for each player
  socket.on('hand', (data) => {

    // Drawing the user's hand
    if(data.user_id == userId) {
      let spaces = 0;
      $('#my-hand').html('');
      data.hand.hand.forEach((card) => {
        $('#my-hand').append(`
          <img style="position: absolute; left: ${spaces}px" id="${card.color}_${card.symbol}" src="/images/${card.color}_${card.symbol}.png">
        `);
        spaces += 60;
      });
    } else { //Drawing opponent's details 
      if(data.turn_number != undefined) {
        if($('#opponent-1').html() == "") {
          $(`#opponent-1`).html(`
            <img id='oc1' class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)  
        } else if($('#opponent-2').html() == "") {
          $(`#opponent-2`).html(`
            <img id='oc2' class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)
        } else {
          $(`#opponent-3`).html(`
            <img id='oc3' class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)
        }
      }
    }
  });


  // Updating current card
  socket.on('new current card', (data) => {
    $('#start-button').hide();
    $('#play-deck').html(`
      <img class="mx-auto d-block" id="play-deck" src="/images/${data.current_card.color}_${data.current_card.symbol}.png">
    `)
  });

  // Remove played card
  socket.on('remove card', (data) => {
    if(data.user_id == userId) {
      $(`#${data.card.color}_${data.card.symbol}`).remove();
    } else {
      updateNcards(data.user_id, -1);
    }
  })


  // Error message
  socket.on('error', (data) => {
    if(data.user_id == userId) {
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
      `);
    }
  });

  // Change Color
  socket.on('change color', (data) => {
    if(data.user_id == userId) {
      $('#color-picker').html(`
        <div id="red" class="row"></div>
				<div id="blue" class="row"></div>
				<div id="green" class="row"></div>
				<div id="yellow" class="row"></div>
      `)
      $('#color-picker').on('click', function(event) {
        let newColor = event.target.id;
        socket.emit('new color', {color: newColor, room_id: roomId});
        $('#color-picker').html('');
        $('#color-picker').off('click');
      });
    }  
  });

  // After a player wins
  socket.on('won', (data) => {
    let name;
    let score;
    if(data.user_id == userId) {
      name = "You";
      score = "Score: " + data.score;
    } else {
      name = data.username
      score = "";
    }

    // Change action of leave room button after game is over.
    $('#leave-room').attr('method', 'GET');
    $('#leave-room').attr('action', '/');

    $('#game-area').html(`<div id="message" style="position: absolute; left: 30%; top:40%; width:50%;">
        <div class="alert alert-success center" role="alert">
          ${name} won! ${score}
        </div>
      </div>
    `)
  })
  //============================================================

});