const database = require('../index');

const REVERSE_QUERY = `UPDATE player 
  SET turn_number = CASE WHEN n_players - turn_number > 0
  THEN n_players - turn_number
  ELSE n_players END
  FROM gameroom 
  WHERE gameroom.id = player.room_id
  AND room_id = $1`;

const reverseTurns = (room_id) => {
  const VALUE = room_id;
  return database
    .query(REVERSE_QUERY, VALUE)
    .catch(error => {console.log("In reverse.js: "+error.stack)});
};

module.exports = reverseTurns;