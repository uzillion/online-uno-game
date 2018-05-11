const game = require('../db/game');
const player = require('../db/player');
const getPlayer = require('../db/gameroom/getPlayer');

const card_functions = {
  d2: (room_id) => {
        return player.nextPlayer(room_id).then((nextPlayer) => {
          console.log("In d2: "+JSON.stringify(nextPlayer));
          return player.drawCard(nextPlayer.user_id, room_id, 2);
        });
      },
  d4: (room_id) => {
        return player.nextPlayer(room_id).then((nextPlayer) => {
          console.log("In d2: "+JSON.stringify(nextPlayer));
          return player.drawCard(nextPlayer.user_id, room_id, 4);
        });
      },
  wildcard: (room_id, newColor) => {
              return game.changeColor(room_id, newColor);
            },
  reverse: (room_id, user_id) => {
              return game.reverse(room_id).then(() => {
                return getPlayer(user_id, room_id).then((playerData) => {
                  return game.setTurn(playerData.turn_number);
                });
              });
            },
  skip: (room_id) => {
              return game.nextTurn(room_id); 
            }
};

module.exports =  card_functions;