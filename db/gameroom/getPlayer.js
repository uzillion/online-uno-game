const database = require('../index');

const GET_PLAYER_QUERY = `SELECT * FROM player
  WHERE user_id = $1 AND room_id = $2`;

const getPlayer = (user_id, room_id, callback) => {
  database
    .many(GET_PLAYER_QUERY, [user_id, room_id])
    .then(callback)
    .catch( error => {return callback(error); console.log( "Could not get player: ", error)});
}

module.exports = getPlayer;