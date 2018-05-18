const gameroom = require('../../db/gameroom');
const game = require('../../db/game');
const gameMods = require('../../game_modules');
const player = require('../../db/player');

const roomSocket = (io) => {
  const room = io.of('/gameroom');
  room.on('connection', function(socket) {

    let socketRoomId = socket.handshake.query.id
    socket.join(socket.handshake.query.id);  


    const broadcastTurn = (current_turn, room_id) => {
      gameroom.getPlayerByTurn(current_turn, room_id).then(playerData => {
        room.to(socketRoomId).emit('change turn', {user_id: playerData.user_id, username: playerData.username});
      });
    }

    socket.on('chat message', (data) => {
      room.to(socketRoomId).emit('message recieved', data);
    });
    // console.log("Socket id: "+socket.handshake.query.id);      
    socket.on('joined room', (data) => {
      room.to(socketRoomId).emit("player joined", {joinedPlayer: data.username})      
      gameroom.getPlayers(data.room_id).then((players) => {
        players.forEach(function(roomPlayer) {
          socket.emit("player joined", {joinedPlayer: roomPlayer.username})
        });
      });
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        if(dbRoom.current_turn > 0) {
          gameroom.getPlayers(dbRoom.id).then((players) => {
            players.forEach(function(roomPlayer) {
              socket.emit('hand', {username: roomPlayer.username, user_id: roomPlayer.user_id, turn_number: roomPlayer.turn_number, hand: roomPlayer.hand});
            });
            socket.emit('new current card', {current_card: dbRoom.current_card});
            broadcastTurn(dbRoom.current_turn, data.room_id);
          });
        }
      });
      room.emit('add room button', data );
    });

    socket.on('get hand', (data) => {
      gameroom.getPlayer(data.user_id, data.room_id).then((player) => {
        // console.log(player);
        socket.emit('hand', {hand: player.hand});
      });
    });    
    
    // Start Game
    socket.on('start game', (data) => {
      // console.log("Start signal received");
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        gameroom.getPlayer(data.user_id, data.room_id).then((currentPlayer) => {
          if(currentPlayer.turn_number == 1 && dbRoom.n_players > 1) {
            game.startGame(dbRoom.id, gameMods.deck).then((currentCard) => {
              gameroom.getPlayers(dbRoom.id).then((players) => {
                players.forEach(function(roomPlayer) {
                  room.to(socketRoomId).emit('hand', {username: roomPlayer.username, user_id: roomPlayer.user_id,
                    turn_number: roomPlayer.turn_number, hand: roomPlayer.hand});
                });
                broadcastTurn(1, data.room_id);
              });
              room.to(socketRoomId).emit('new current card', {current_card: currentCard});
              room.to(socketRoomId).emit('game started');
            });
          }
        });
      });
    })

    socket.on('draw card', (data) => {
      gameMods.validateTurn(data.room_id, data.user_id, function(result, turn) {
        if(result) {
          player.drawCard(data.user_id, data.room_id, 1).then((drawnCards) => {
            room.to(socketRoomId).emit('card drawn', {user_id: data.user_id, card: drawnCards[0]});
          });
        }
      });
    });

    socket.on('pass turn', (data) => {
      gameMods.validateTurn(data.room_id, data.user_id, function(result, turn) {
        if(result) {
          game.nextTurn(data.room_id).then((newCurrentTurn) => {
            // console.log(newCurrentTurn);
            broadcastTurn(newCurrentTurn.current_turn, data.room_id);
          });
        }
      });
    });

    socket.on('play card', (data) => {
      // console.log(data);
      gameMods.validateCard(data.user_id, data.room_id, data.card, function(result, playError) {
        if(result == true) {
          player.playCard(data.room_id, data.user_id, data.card).then((playedCard) => {
            // console.log("playedCard: "+JSON.stringify(playedCard));
            console.log(playedCard);
            // console.log(gameMods.cardFunc[playedCard.symbol]);
            if( gameMods.cardFunc[playedCard.symbol] != undefined) {
              room.to(socketRoomId).emit('new current card', {current_card: data.card});
              if(playedCard.symbol != 'wildcard') {
                // console.log(gameMods.cardFunc[playedCard.symbol].toString());
                gameMods.cardFunc[playedCard.symbol](data.room_id, data.user_id).then((playData) => {
                  if(playedCard.symbol == "d2" || playedCard.symbol == "d4") {
                    // console.log("Checking room id: "+data.room_id);
                    return player.nextPlayer(data.room_id).then((nextPlayer) => {
                      // console.log(nextPlayer);
                      room.to(socketRoomId).emit('add cards', {user_id: nextPlayer.user_id, cards: playData});
                      if(playedCard.symbol == "d4") {
                        room.to(socketRoomId).emit('change color', {user_id: data.user_id});                
                      }
                    });
                  }
                }).then(() => {
                  game.nextTurn(data.room_id).then((nextTurnNumber) => {
                    broadcastTurn(nextTurnNumber.current_turn, data.room_id);
                  });
                });
              } else {
                room.to(socketRoomId).emit('change color', {user_id: data.user_id});
              }
            } else {
              room.to(socketRoomId).emit('new current card', {current_card: data.card});
              game.nextTurn(data.room_id).then((nextTurnNumber) => {
                // console.log(nextTurnNumber);
                broadcastTurn(nextTurnNumber.current_turn, data.room_id);
              });
            }
            room.to(socketRoomId).emit('remove card', {user_id: data.user_id, card: data.card});
            gameroom.getPlayer(data.user_id, data.room_id).then((dbPlayer) => {
              // players.forEach(function(roomPlayer) {
                // console.log(JSON.stringify(dbPlayer));
              if(dbPlayer.hand.hand.length > 0) {
                socket.emit('hand', {user_id: dbPlayer.user_id, turn_number: dbPlayer.turn_number, hand: dbPlayer.hand});
              } else {
                gameMods.calcScore(data.room_id).then((calcedScore) => {
                  player.updateScore(dbPlayer.user_id, calcedScore).then(() => {
                    gameroom.getPlayers(data.room_id).then((players) => {
                      // players.forEach((roomPlayer) => {
                      //   gameroom.removePlayer({userId: data.user_id, roomId: data.room_id}).then(() => {
                      //   });
                      // });
                      room.to(socketRoomId).emit('won', {user_id: dbPlayer.user_id, username: data.username, score: calcedScore});
                    });
                  });
                });
              }
            });
            // dbPlayer.playCard(data.room_id, data.user_id, data.card);
          });
        } else {
          console.log(playError);
          room.to(socketRoomId).emit('error', {user_id: data.user_id, error: playError});
          // socket.emit('error', {error: playError});
        }
      });
    });

    socket.on('new color', (data) => {
      game.changeColor(data.room_id, data.color);
      room.to(socketRoomId).emit('new current card', {current_card: {color: data.color, symbol: "none"}});
      console.log("Signal emitted");
      // game.nextTurn(data.room_id, function(nextTurnNumber) {
      //   console.log(nextTurnNumber);
      //   room.to(socketRoomId).emit('change turn', {turn_number: nextTurnNumber.current_turn});
      // });
    });

    socket.on('check uno', (data) => {
      gameroom.getPlayer(data.user_id, data.room_id).then((dbPlayer) => {
        if(dbPlayer.hand.hand.length == 1) {
          room.to(socketRoomId).emit('uno called', {user_id: data.user_id});
        } else {
          player.drawCard(data.user_id, data.room_id, 2).then((playData) => {
            room.to(socketRoomId).emit('add cards', {user_id: data.user_id, cards: playData});
          });
        }
      });
    });

    socket.on('caught', (data) => {
      player.drawCard(data.user_id, data.room_id, 2).then((playData) => {
        room.to(socketRoomId).emit('add cards', {user_id: data.user_id, cards: playData});
      });
    });

  });
}

module.exports = roomSocket;