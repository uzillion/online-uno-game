const database = require('../index');

const NEXT_TURN_QUERY = `SELECT user_id FROM player 
  INNER JOIN gameroom 
  ON player.room_id = gameroom.id 
  WHERE turn_number = mod(current_turn, n_players) + 1`;

const nextPlayer = (room_id, callaback) => {
  const VALUE = room_id;
  database
    .one(NEXY_TURN_QUERY, VALUE)
    .then(callaback);
};

module.exports = nextPlayer;