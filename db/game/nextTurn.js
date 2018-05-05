const database = require('../index');

const NEXT_TURN_QUERY = `UPDATE gameroom 
  SET current_turn = mod(current_turn, n_players) + 1 
  FROM player 
  WHERE gameroom.id = player.room_id AND room_id = $1
  RETURNING current_turn`;

// const GET_NEXT_PLAYER_QUERY = `SELECT user_id FROM player
//   WHERE turn_number = $1`;

const nextTurn = (room_id) => {
  const VALUE = room_id;
  return database
    .one(NEXT_TURN_QUERY, VALUE)
    .catch(error => {console.log("In nextTurn.js: "+error.stack)});
};

module.exports = nextTurn;