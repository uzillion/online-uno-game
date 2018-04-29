const database = require('../index');

const NEXT_TURN_QUERY = `UPDATE gameroom 
  SET current_turn = mod(current_turn, n_players) + 1 
  FROM gameroom 
  WHERE gameroom.id = player.room_id
  AND room_id = $1`;

const nextTurn = (room_id) => {
  const VALUE = room_id;
  database
    .query(REVERSE_QUERY, VALUE);
};

module.exports = nextTurn;