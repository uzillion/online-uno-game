const getRoom = require('../db/gameroom/getRoom');
const getPlayer = require('../db/gameroom/getPlayer');

const validate_turn = (room_id, user_id, callback) => {
  getRoom(room_id).then((dbRoom) => {
    getPlayer(user_id, room_id).then((currentPlayer) => {
      if(dbRoom.current_turn == currentPlayer.turn_number) {
        callback(true);
      } else {
        callback(false, dbRoom.current_turn);
      }
    });
  });
}

module.exports = validate_turn;