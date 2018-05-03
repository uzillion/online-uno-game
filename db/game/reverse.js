const database = require('../index');

const REVERSE_QUERY = `UPDATE player 
  SET turn_number = n_player - turn_number 
  FROM gameroom 
  WHERE gameroom.id = player.room_id
  AND room_id = $1`;

const reverseTurns = (room_id) => {
  const VALUE = room_id;
  database
    .query(REVERSE_QUERY, VALUE);
};

module.exports = reverseTurns;