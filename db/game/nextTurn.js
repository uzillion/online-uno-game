const database = require('../index');

const NEXT_TURN_QUERY = `UPDATE gameroom 
  SET current_turn = mod(current_turn, n_players) + 1 
  FROM gameroom 
  WHERE gameroom.id = player.room_id AND room_id = $1
  RETURNING current_turn`;

const GET_NEXT_PLAYER_QUERY = `SELECT user_id FROM player
  WHERE turn_number = $1`;

const nextTurn = (room_id, callback) => {
  const VALUE = room_id;
  database
    .one(NEXT_TURN_QUERY, VALUE)
    .then((current_turn) => {
      database.one(GET_NEXT_PLAYER_QUERY, current_turn);
    }).then(callback);
};

module.exports = nextTurn;