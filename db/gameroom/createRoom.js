const database = require('../index');

const CREATE_ROOM_QUERY = `INSERT INTO gameroom DEFAULT VALUES
  RETURNING "id"`;

const createRoom = (callback) => {

  return database
    .one( CREATE_ROOM_QUERY)
    .then(callback)
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = createRoom;
