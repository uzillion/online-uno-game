const gameroom = require('../db/gameroom');
const game = require('../db/game');
const deck = require('../game_modules/deck');
const validateCard = require('../game_modules/validate_card');
const player = require('../db/player');

const socket = (server) => {
  
  var io = require('socket.io')(server);

  var sockets = [];

  const lobby = io.of('/lobby');
  const room = io.of('/gameroom');

  io.on('connection', function(socket){
    sockets.push(socket);
    console.log('#%s socket connected', sockets.length);
    // user disconnect 
    socket.on('disconnect', function(data){
      sockets.splice(sockets.indexOf(socket),1);
      console.log('#%s socket disconnected', sockets.length);
    });
  });

  lobby.on('connection', function(socket){
    //send a message
    socket.on('chat message', function(data){
      console.log(data);
      lobby.emit('chat message', data);
    });
  });

// ============================ Room Connections ============================

  room.on('connection', function(socket) {
    // console.log("Socket id: "+socket.handshake.query.id);    
    let socketRoomId = socket.handshake.query.id
    socket.join(socket.handshake.query.id);    
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
                  room.to(socketRoomId).emit('hand', {user_id: roomPlayer.user_id, turn_number: roomPlayer.turn_number, hand: roomPlayer.hand});
                });
              });
              room.to(socketRoomId).emit('new current card', {current_card: currentCard});
            });
          }
        });
      });
    })

    socket.on('play card', function(data) {
      validateCard(data.user_id, data.room_id, data.card, function(result, playError) {
        if(result == true) {
          player.playCard(data.room_id, data.user_id, data.card);
          room.to(socketRoomId).emit('new current card', {current_card: data.card});
          game.nextTurn(data.room_id, function(userId) {
            room.to(socketRoomId).emit('active turn', {user_id: userId});
          });
        }
        else
          socket.emit('error', {error: playError});
      });
    });

    socket.on('change color', function(data) {
      game.changeColor(data.room_id, data.color);
      room.to(socketRoomId).emit('new current color', {color: data.color});
    });

  });

}
module.exports = socket;