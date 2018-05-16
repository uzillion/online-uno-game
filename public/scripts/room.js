$(function () {

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

  // $('#play-card').hide();
  let roomId = parseInt($('#room-id').val());
  let userId = parseInt($('#user-id').val());
  let username = $('#username').val();

  $('#opponents div').hover((event) => {
    // console.log(event.target.id);
    $(`#${event.target.id}`).find('.ncard').css('opacity', '1');
  }, (event) => {
    $(`#${event.target.id}`).find('.ncard').css('opacity', '0');
  });

  //=================== SOCKET CONNECTIONS ====================
  var socket = io.connect('/gameroom', {query: `id=${roomId}`});
  
  // Room Created signal
  socket.emit('joined room', {room_id: roomId, user_id: userId});

  // Start Game
  $('#start-button').on('click', function() {
    socket.emit('start game', {room_id: roomId, user_id: userId});
    // socket.emit('get hand', {user_id: userId, room_id: roomId});
    // $('#play-card').show();          
    // $('#start-button').hide();
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
    // console.log(event.target.id);
    // $(`#${event.target.id}`).remove();
    // console.log(selectedCard);
    // socket.emit('play card', {room_id: roomId, user_id: userId, card: selectedCard})
  });

  $('#draw-card').on('click', function() {
    socket.emit('draw card', {user_id: userId, room_id: roomId});
  });

  $('#pass-turn').on('click', function() {
    socket.emit('pass turn', {room_id: roomId, user_id: userId});
  });

  socket.on('change turn', function(data) {
    if(data.user_id != userId) {
      $('#draw-card').prop('disabled', true);
      $('#pass-trun').prop('disabled', true);      
    } else {
      $('#draw-card').prop('disabled', false);
      $('#pass-trun').prop('disabled', false); 
    }
    $('#turn-indicator').html(`<h6 style="color:red"><strong>${data.username}'s turn</strong></h4>`);
  });

  socket.on('card drawn', function(data) {
    if(data.user_id == userId) {
      $('#draw-card').prop('disabled', true);    
      let position = parseInt($('#my-hand img').last().css('left'));
      console.log(position);    
      $('#my-hand').append(`
        <img style="position: absolute; left: ${position+60}px" id="${data.card.color}_${data.card.symbol}" src="/images/${data.card.color}_${data.card.symbol}.png">
      `);
    } else {
      let old_val = parseInt($(`#${data.user_id}`).text());
      console.log(old_val, typeof old_val);
      $(`#${data.user_id}`).html(`${old_val+1}`);
    }
  });

  socket.on('add cards', function(data) {
    if(data.user_id ==  userId) {
      console.log("HANDololu: "+JSON.stringify(data.cards));
      data.cards.forEach((card) => {
        let position = parseInt($('#my-hand img').last().css('left'));
        $('#my-hand').append(`
          <img style="position: absolute; left: ${position+60}px" id="${card.color}_${card.symbol}" src="/images/${card.color}_${card.symbol}.png">
        `);
      });
    } else {
      let old_val = parseInt($(`#${data.user_id}`).text());
      console.log(old_val, typeof old_val);
      $(`#${data.user_id}`).html(`${old_val+data.cards.length}`);
    }
  });


  socket.on('hand', function(data) {
    console.log(data.username);
    if(data.user_id == userId) {
      let spaces = 0;
      // $('#my-hand').html(`<h5 style="color: red">Player ${data.turn_number}</h5>`);
      $('#my-hand').html('');
      // console.log(JSON.stringify(data.hand));
      data.hand.hand.forEach((card) => {
        $('#my-hand').append(`
          <img style="position: absolute; left: ${spaces}px" id="${card.color}_${card.symbol}" src="/images/${card.color}_${card.symbol}.png">
        `);
        spaces += 60;
      });
    } else {
      if(data.turn_number != undefined) {
        if($('#opponent-1').html() == "") {
          $(`#opponent-1`).html(`
            <img class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)  
        } else if($('#opponent-2').html() == "") {
          $(`#opponent-2`).html(`
            <img class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)
        } else {
          $(`#opponent-3`).html(`
            <img class="mx-auto d-block" src="/images/card_back_alt.png">
            <p style="color:red">${data.username}<span class="ncard">: <span id="${data.user_id}">${data.hand.hand.length}</span> cards</span></p>
          `)
        }
      }
    }
  });

  // // Next Turn
  // socket.on('active turn', function(data) {
  //   if(data.user_id == userId) {
  //     $('#turn-indicator').show();
  //   } else {
  //     $('#turn-indicator').hide();        
  //   }
  // });

  // Update current card
  socket.on('new current card', function(data) {
    console.log("New Current card: " + data);
    $('#play-deck').html(`
      <img class="mx-auto d-block" id="play-deck" src="/images/${data.current_card.color}_${data.current_card.symbol}.png">
    `)
  });

  socket.on('remove card', function(data) {
    if(data.user_id == userId) {
      console.log("card removed");
      $(`#${data.card.color}_${data.card.symbol}`).remove();
    } else {
      let old_val = parseInt($(`#${data.user_id}`).text());
      console.log(old_val, typeof old_val);
      $(`#${data.user_id}`).html(`${old_val-1}`);
    }
  })

  socket.on('message', function(){});

  socket.on('error', function(data) {
    if(data.user_id == userId) {
      console.log(data);
      let error_message;
      if(data.error == 'invalid') {
        error_message = "Sorry, that's an invalid card to play"
      } else if(data.error == 'outofturn') {
        error_message = "Sorry, you cannot play this card on other's turn"
      }
      console.log(error_message);
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
  socket.on('change color', function(data) {
    if(data.user_id == userId) {
      $('#my-hand').on('click', function(event) {
        let newColor = event.target.id.split('_')[0];
        console.log(newColor);
        socket.emit('new color', {color: newColor, room_id: roomId});
        $('#my-hand').off('click');
      });
    }  
  });

  socket.on('won', function(data) {
    let name;
    let score;
    if(data.user_id == userId) {
      name = "You";
      score = "Score: " + data.score;
    } else {
      name = data.username
      score = "";
    }
    $('#game-area').html(`<div id="message" style="position: absolute; left: 30%; top:40%; width:50%;">
        <div class="alert alert-success center" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          ${name} won! ${score}
        </div>
      </div>
    `)
  })
  //============================================================
  

});