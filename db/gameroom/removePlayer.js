const database = require('../index');

const REMOVE_PLAYER_QUERY = `DELETE FROM player
  WHERE user_id=$1 AND room_id=$2`;

const removePlayer = (playerObject) => {
  const VALUES = [ playerObject.user_id, playerObject.room_id];

  return database
    .one( REMOVE_PLAYER_QUERY, VALUES )
    .then((player) => {
      database.query(`UPDATE gameroom SET n_players=n_players-1 WHERE id=${playerObject.roomId}`);
    })
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = removePlayer;
