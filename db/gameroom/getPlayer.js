const database = require('../index');

const GET_PLAYER_QUERY = `SELECT * FROM player
  WHERE user_id = $1 AND room_id = $2`;

const getPlayer = (user_id, room_id) => {
  return database
    .one(GET_PLAYER_QUERY, [user_id, room_id])
    .catch( error => { console.log( "Could not get player: ", error.stack);});
}

module.exports = getPlayer;