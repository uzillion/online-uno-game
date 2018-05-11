const database = require('../index');

const SET_TURN_QUERY = `UPDATE gameroom 
  SET current_turn = $1`;

// const GET_NEXT_PLAYER_QUERY = `SELECT user_id FROM player
//   WHERE turn_number = $1`;

const setTurn = (turn_number) => {
  return database
    .none(SET_TURN_QUERY, turn_number)
    .catch(error => {console.log("In setTurn.js: "+error.stack)});
};

module.exports = setTurn;