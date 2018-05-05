
const getRoom = require('../db/gameroom/getRoom');
const getPlayer = require('../db/gameroom/getPlayer');

const validate_card = (user_id, room_id, card, callback) => {
  getRoom(room_id).then((room) => {
    getPlayer(user_id, room_id).then((player) => {
      console.log("current_card: "+JSON.stringify(room.current_card));
      console.log("card: "+JSON.stringify(card));
      if(card.symbol != 'wildcard') {
        if(room.current_turn == player.turn_number) {
          if(card.color == room.current_card.color || card.symbol == room.current_card.symbol) {
            callback(true);
          } else {
            // callback(false, "Sorry, that is not a valid card to play");
            callback(false, "invalid");
          }
        } else {
          // callback(false, "Sorry, it is not your turn");
          callback(false, "outofturn");
        }
      } else {        
        callback(true);
      }
    })
  });
};

module.exports = validate_card;