const gameroom = require('../db/gameroom');
const game = require('../db/game');
const deck = require('../game_modules/deck');
const cardFunc = require('../game_modules/card_function');
const validateCard = require('../game_modules/validate_card');
const player = require('../db/player');

const mainSocket = (server) => {
  
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
    socket.on('joined room', function(data) {
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        if(dbRoom.current_turn > 0) {
          gameroom.getPlayers(dbRoom.id).then((players) => {
            players.forEach(function(roomPlayer) {
              socket.emit('hand', {user_id: roomPlayer.user_id, turn_number: roomPlayer.turn_number, hand: roomPlayer.hand});
            });
            socket.emit('new current card', {current_card: dbRoom.current_card});
            socket.emit('change turn', {turn_number: dbRoom.current_turn});
          });
        }
      });
      room.emit('add room button', data );
    });

    socket.on('get hand', function(data) {
      gameroom.getPlayer(data.user_id, data.room_id).then((player) => {
        // console.log(player);
        socket.emit('hand', {hand: player.hand});
      });
    });    
    
    // Start Game
    socket.on('start game', function(data) {
      // console.log("Start signal received");
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        gameroom.getPlayer(data.user_id, data.room_id).then((currentPlayer) => {
          if(currentPlayer.turn_number == 1 && dbRoom.n_players > 1) {
            game.startGame(dbRoom.id, deck).then((currentCard) => {
              gameroom.getPlayers(dbRoom.id).then((players) => {
                players.forEach(function(roomPlayer) {
                  room.to(socketRoomId).emit('hand', {user_id: roomPlayer.user_id, turn_number: roomPlayer.turn_number, hand: roomPlayer.hand});
                });
              });
              room.to(socketRoomId).emit('new current card', {current_card: currentCard});
              room.to(socketRoomId).emit('change turn', {turn_number: 1});
              room.to(socketRoomId).emit('game started');
            });
          }
        });
      });
    })

    socket.on('draw card', function(data) {
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        gameroom.getPlayer(data.user_id, data.room_id).then((currentPlayer) => {
          if(dbRoom.current_turn == currentPlayer.turn_number) {
            player.drawCard(data.user_id, data.room_id, 1).then((drawnCards) => {
              socket.emit('card drawn', {card: drawnCards[0]});
            });
          }
        });
      });
    });

    socket.on('pass turn', function(data) {
      game.nextTurn(data.room_id).then((newCurrentTurn) => {
        console.log(newCurrentTurn);
        room.to(socketRoomId).emit('change turn', {turn_number: newCurrentTurn.current_turn});
      });
    });

    socket.on('play card', function(data) {
      // console.log(data);
      validateCard(data.user_id, data.room_id, data.card, function(result, playError) {
        if(result == true) {
          player.playCard(data.room_id, data.user_id, data.card).then((playedCard) => {
            // console.log("playedCard: "+JSON.stringify(playedCard));
            console.log(playedCard);
            console.log(cardFunc[playedCard.symbol]);
            if( cardFunc[playedCard.symbol] != undefined) {
              if(playedCard.symbol != 'wildcard') {
                room.to(socketRoomId).emit('new current card', {current_card: data.card});
                console.log(cardFunc[playedCard.symbol].toString());
                cardFunc[playedCard.symbol](data.room_id).then((playData) => {
                  if(playedCard.symbol == "d2" || playedCard.symbol == "d4") {
                    console.log("Checking room id: "+data.room_id);
                    return player.nextPlayer(data.room_id).then((nextPlayer) => {
                      console.log(nextPlayer);
                      room.to(socketRoomId).emit('add cards', {user_id: nextPlayer.user_id, cards: playData});
                    });
                  }
                }).then(() => {
                  game.nextTurn(data.room_id).then((nextTurnNumber) => {
                    room.to(socketRoomId).emit('change turn', {turn_number: nextTurnNumber.current_turn});
                  });
                });
              } else {
                room.to(socketRoomId).emit('change color', {user_id: data.user_id});
              }
            } else {
              room.to(socketRoomId).emit('new current card', {current_card: data.card});
              game.nextTurn(data.room_id).then((nextTurnNumber) => {
                console.log(nextTurnNumber);
                room.to(socketRoomId).emit('change turn', {turn_number: nextTurnNumber.current_turn});
              });
            }
            room.to(socketRoomId).emit('remove card', {user_id: data.user_id, card: data.card});
            // player.playCard(data.room_id, data.user_id, data.card);
          });
        } else {
          console.log(playError);
          room.to(socketRoomId).emit('error', {user_id: data.user_id, error: playError});
          // socket.emit('error', {error: playError});
        }
      });
    });

    socket.on('new color', function(data) {
      game.changeColor(data.room_id, data.color);
      room.to(socketRoomId).emit('new current card', {current_card: {color: data.color, symbol: "none"}});
      console.log("Signal emitted");
      // game.nextTurn(data.room_id, function(nextTurnNumber) {
      //   console.log(nextTurnNumber);
      //   room.to(socketRoomId).emit('change turn', {turn_number: nextTurnNumber.current_turn});
      // });
    });

  });

}
module.exports = mainSocket;