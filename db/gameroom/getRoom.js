const database = require('../index');

const GET_ROOM_QUERY = `SELECT * FROM gameroom
WHERE id=$1`;

const getRoom = (ID) => {
  const VALUE = ID;
  return database
    .oneOrNone(GET_ROOM_QUERY, VALUE)
    .catch( error => {console.log( "Could not get rooms: ", error.stack)});
}

module.exports = getRoom;