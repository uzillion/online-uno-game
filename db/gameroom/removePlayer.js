const database = require('../index');

const REMOVE_PLAYER_QUERY = `DELETE FROM player
  WHERE user_id=$1 AND room_id=$2`;

const removePlayer = (playerObject) => {
  const VALUES = [ playerObject.userId, playerObject.roomId];

  return database
    .none( REMOVE_PLAYER_QUERY, VALUES )
    .then(() => {
      console.log("Player left the room");
      return database
        .one(`UPDATE gameroom SET n_players=n_players-1 WHERE id=${playerObject.roomId}
              RETURNING n_players`)
        .then((result) => {
          if(result.n_players == 0)
            return database.query(`DELETE FROM gameroom WHERE id=${playerObject.roomId}`);
        });
    })
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = removePlayer;
