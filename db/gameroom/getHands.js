const database = require('../index');

const GET_HANDS_QUERY = `SELECT hand FROM player
  WHERE room_id = $1`;

const getHands = (room_id) => {
  return database
    .any(GET_HANDS_QUERY, room_id)
    .catch((error) => {console.log('In getHands.js: '+error.stack)});
}

module.exports = getHands;