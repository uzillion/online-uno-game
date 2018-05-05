const database = require('../index');

const GET_PLAYERS_QUERY = `SELECT * FROM player
  WHERE room_id = $1`;

const getPlayers = (room_id) => {
  return database
    .many(GET_PLAYERS_QUERY, room_id)
    .catch( error => {console.log( "Could not get players: ", error.stack)});
}

module.exports = getPlayers;