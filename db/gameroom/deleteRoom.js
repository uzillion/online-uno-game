const database = require('../index');

const DELETE_PLAYERS_QUERY = `DELETE FROM player WHERE room_id = $1`;
const DELETE_ROOM_QUERY = `DELETE FROM gameroom WHERE id = $1`;

const deleteRoom = (room_id) => {
  return database
    .query(DELETE_PLAYERS_QUERY, room_id)
    .then(() => {
      return database.query(DELETE_ROOM_QUERY, room_id);
    }).catch((error) => {console.log("In deleteRoom.js: "+error.stack)});
}

module.exports = deleteRoom;