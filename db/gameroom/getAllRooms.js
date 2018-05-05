const database = require('../index');

const GET_ROOMS_QUERY = `SELECT * FROM gameroom`;

const getAllRooms = () => {
  return database
    .manyOrNone(GET_ROOMS_QUERY)
    .catch( error => {console.log( "Could not get rooms: ", error.stack)});
}

module.exports = getAllRooms;
