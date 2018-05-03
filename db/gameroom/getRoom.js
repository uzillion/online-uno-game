const database = require('../index');

const GET_ROOM_QUERY = `SELECT * FROM gameroom
WHERE id=$1`;

const getRoom = (ID, callback) => {
  const VALUE = ID;
  database
    .oneOrNone(GET_ROOM_QUERY, VALUE)
    .then((data) => {callback(data)})
    .catch( error => {return callback(error); console.log( "Could not get rooms: ", error)});
}

module.exports = getRoom;