const database = require('../index');

const GET_PLAYERS_QUERY = `SELECT * FROM player
  WHERE room_id = $1`;

const getPlayers = (room_id, callback) => {
  database
    .many(GET_PLAYERS_QUERY, room_id)
    .then(callback)
    .catch( error => {return callback(error); console.log( "Could not get players: ", error)});
}

module.exports = getPlayers;