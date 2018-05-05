const database = require('../index');

const CREATE_ROOM_QUERY = `INSERT INTO gameroom DEFAULT VALUES
  RETURNING "id", "n_players"`;

const createRoom = () => {

  return database
    .one( CREATE_ROOM_QUERY)
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = createRoom;
