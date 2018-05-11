const database = require('../index');

const GET_PLAYER_QUERY = `SELECT users.username, user_id FROM player
  INNER JOIN users
  ON player.user_id = users.id
  WHERE turn_number = $1 AND room_id = $2`;

const getPlayerByTurn = (turn_number, room_id) => {
  return database
    .one(GET_PLAYER_QUERY, [turn_number, room_id])
    .catch( error => { console.log( "Could not get player: ", error.stack);});
}

module.exports = getPlayerByTurn;