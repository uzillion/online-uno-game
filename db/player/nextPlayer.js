const database = require('../index');

const NEXT_TURN_QUERY = `SELECT user_id, hand FROM player 
  INNER JOIN gameroom 
  ON player.room_id = gameroom.id 
  WHERE turn_number = mod(current_turn, n_players) + 1
  AND room_id = $1`;

const nextPlayer = (room_id) => {
  const VALUE = room_id;
  return database
    .one(NEXT_TURN_QUERY, VALUE)
    .catch(error => {console.log("In nextPlayer.js: "+error)});
};

module.exports = nextPlayer;