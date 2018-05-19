const gameroom = require('../../db/gameroom');
const game = require('../../db/game');
const gameMods = require('../../game_modules');
const player = require('../../db/player');

// Socket request and responses for gameroom
const roomSocket = (io) => {
  const room = io.of('/gameroom');
  room.on('connection', function(socket) {

    // Joining player socket to the specific gameroom
    let socketRoomId = socket.handshake.query.id
    socket.join(socket.handshake.query.id);  

    // Broadcast current turn to all players
    const broadcastTurn = (current_turn, room_id) => {
      gameroom.getPlayerByTurn(current_turn, room_id).then(playerData => {
        room.to(socketRoomId).emit('change turn', {user_id: playerData.user_id, username: playerData.username});
      });
    }

    // Gameroom chat message
    socket.on('chat message', (data) => {
      room.to(socketRoomId).emit('message recieved', data);
    });

    // Do when a player joins a room
    socket.on('joined room', (data) => {
      room.to(socketRoomId).emit("player joined", {joinedPlayer: data.username})      
      gameroom.getPlayers(data.room_id).then((players) => {
        players.forEach(function(roomPlayer) {

          // Broadcast when a player joins a room
          socket.emit("player joined", {joinedPlayer: roomPlayer.username})
        });
      });
      gameroom.getRoom(data.room_id).then((dbRoom) => {

        // If game has already started send game state to player who rejoined
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

      // Add join room button in lobby
      room.emit('add room button', data );
    });

    // Get hand of a player
    socket.on('get hand', (data) => {
      gameroom.getPlayer(data.user_id, data.room_id).then((player) => {

        socket.emit('hand', {hand: player.hand});
      });
    });    
    
    // Start game actions
    socket.on('start game', (data) => {
      gameroom.getRoom(data.room_id).then((dbRoom) => {
        gameroom.getPlayer(data.user_id, data.room_id).then((currentPlayer) => {

          // Checking if there are atleast 2 people in the room,
          // and the person who is starting is the creator of the room.
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

    // Draw card from the draw deck
    socket.on('draw card', (data) => {
      gameMods.validateTurn(data.room_id, data.user_id, function(result, turn) {
        if(result) {
          player.drawCard(data.user_id, data.room_id, 1).then((drawnCards) => {
            room.to(socketRoomId).emit('card drawn', {room_id: data.room_id, user_id: data.user_id, card: drawnCards[0]});
          });
        }
      });
    });

    // Pass turn to next player
    socket.on('pass turn', (data) => {
      gameMods.validateTurn(data.room_id, data.user_id, function(result, turn) {
        if(result) {
          game.nextTurn(data.room_id).then((newCurrentTurn) => {
            broadcastTurn(newCurrentTurn.current_turn, data.room_id);
          });
        }
      });
    });

    // Play a card
    socket.on('play card', (data) => {

      // Checking if card is a valid play
      gameMods.validateCard(data.user_id, data.room_id, data.card, function(result, playError) {
        if(result == true) {
          player.playCard(data.room_id, data.user_id, data.card).then((playedCard) => {

            // Checking if the played card is an action card
            if( gameMods.cardFunc[playedCard.symbol] != undefined) {
              room.to(socketRoomId).emit('new current card', {current_card: data.card});
              if(playedCard.symbol != 'wildcard') {

                // Executing action of action card
                gameMods.cardFunc[playedCard.symbol](data.room_id, data.user_id).then((playData) => {

                  // If cards are either draw 2 or draw 4, make the next player draw cards
                  if(playedCard.symbol == "d2" || playedCard.symbol == "d4") {
                    return player.nextPlayer(data.room_id).then((nextPlayer) => {
                      room.to(socketRoomId).emit('add cards', {user_id: nextPlayer.user_id, cards: playData});

                      // If draw 4, present user with color picker
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
              } else { // Else if card is wild card
                room.to(socketRoomId).emit('change color', {user_id: data.user_id});
              }
            } else {
              room.to(socketRoomId).emit('new current card', {current_card: data.card});
              game.nextTurn(data.room_id).then((nextTurnNumber) => {
                broadcastTurn(nextTurnNumber.current_turn, data.room_id);
              });
            }

            // Removing a played card
            room.to(socketRoomId).emit('remove card', {user_id: data.user_id, card: data.card});
            gameroom.getPlayer(data.user_id, data.room_id).then((dbPlayer) => {

              // Checking if there are more card to play
              if(dbPlayer.hand.hand.length > 0) {
                socket.emit('hand', {user_id: dbPlayer.user_id, turn_number: dbPlayer.turn_number, hand: dbPlayer.hand});
              } else { // Else, signal win, and calculate score
                gameMods.calcScore(data.room_id).then((calcedScore) => {
                  player.updateScore(dbPlayer.user_id, calcedScore).then(() => {
                    room.to(socketRoomId).emit('won', {user_id: dbPlayer.user_id, username: data.username, score: calcedScore});
                    gameroom.deleteRoom(data.room_id);
                  });
                });
              }
            });
          });
        } else { // Display error if card is not a valid play
          room.to(socketRoomId).emit('error', {user_id: data.user_id, error: playError});
        }
      });
    });

    // Updating databse on color change, and broadcasting the new color
    socket.on('new color', (data) => {
      game.changeColor(data.room_id, data.color);
      room.to(socketRoomId).emit('new current card', {current_card: {color: data.color, symbol: "none"}});
    });

    // Checking if uno call is valid, if not penalize by drawing 2 cards.
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

    // If player is caught before calling Uno, adding 2 cards to their hand
    socket.on('caught', (data) => {
      player.drawCard(data.user_id, data.room_id, 2).then((playData) => {
        room.to(socketRoomId).emit('add cards', {user_id: data.user_id, cards: playData});
      });
    });

  });
}

module.exports = roomSocket;