const gameroom = require('../db/gameroom');
const game = require('../db/game');
const deck = require('../game_modules/deck');
const validateCard = require('../game_modules/validate_card');
const player = require('../db/player');

const socket = (server) => {
  
  var io = require('socket.io')(server);

  var sockets = [];

  const room = io.of('/gameroom');

  io.on('connection', function(socket){
    sockets.push(socket);
    console.log('#%s socket connected', sockets.length);
    //send a message
    socket.on('chat message', function(data){
      console.log(data);
      io.emit('chat message', data);
    });
    // user disconnect 
    socket.on('disconnect', function(data){
      sockets.splice(sockets.indexOf(socket),1);
      console.log('#%s socket disconnected', sockets.length);
    });
  });

// ============================ Room Connections ============================

  room.on('connection', function(socket) {
    socket.on('room created', function(data) {
      room.emit('add room button', data );
    });

    socket.on('get hand', function(data) {
      gameroom.getPlayer(data.user_id, data.room_id, function(player) {
        console.log(player);
        socket.emit('hand', {hand: player.hand});
      });
    });    
    
    // Start Game
    socket.on('start game', function(data) {
      console.log("Start signal received");
      gameroom.getRoom(data.room_id, function(dbRoom) {
        gameroom.getPlayer(data.user_id, data.room_id, function(currentPlayer) {
          if(currentPlayer.turn_number == 1 && dbRoom.n_players > 1) {
            game.startGame(dbRoom.id, deck, function(currentCard) {
              gameroom.getPlayers(dbRoom.id, function(players) {
                players.forEach(function(roomPlayer) {
                  player.drawCard(roomPlayer.user_id, dbRoom.id, 7);
                });
              });
              room.emit('new current card', {current_card: currentCard});
            });
          }
        });
      })
    });

    socket.on('play card', function(data) {
      validateCard(data.user_id, data.room_id, data.card, function(result, playError) {
        if(result == true) {
          player.playCard(data.room_id, data.user_id, data.card);
          room.emit('new current card', {current_card: data.card});
          game.nextTurn(data.room_id, function(userId) {
            room.emit('active turn', {user_id: userId});
          });
        }
        else
          socket.emit('error', {error: playError});
      });
    });

    socket.on('change color', function(data) {
      game.changeColor(data.room_id, data.color);
      room.emit('new current color', {color: data.color});
    });

  });

}
module.exports = socket;