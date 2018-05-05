const game = require('../db/game');
const player = require('../db/player');

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
          return player.drawCard(nextPlayer.user_id, room_id, 6);
        });
      },
  wildcard: (room_id, newColor) => {
              return game.changeColor(room_id, newColor);
            },
  reverse: (room_id) => {
              return game.reverse(room_id);
            },
  skip: (room_id) => {
              return game.nextTurn(room_id); 
            }
};

module.exports =  card_functions;