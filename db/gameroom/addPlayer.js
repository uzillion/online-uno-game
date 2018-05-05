const database = require('../index');

const ADD_PLAYER_QUERY = `INSERT INTO player
  (user_id, room_id, turn_number)
  VALUES($1, $2, $3)
  RETURNING "user_id", "room_id"`;

const addPlayer = (playerObject) => {
  const VALUES = [ playerObject.userId, playerObject.roomId, playerObject.turn];

  return database
    .oneOrNone( ADD_PLAYER_QUERY, VALUES )
    .then((player) => {
      console.log(player);
      database.query(`UPDATE gameroom SET n_players=n_players+1 WHERE id=${playerObject.roomId}`);
      return player;
    })
    .catch( error => {
      console.log("Failed to add player");
      console.log( "ERROR: ", error ) });
};

module.exports = addPlayer;
