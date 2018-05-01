const database = require('../index');
const playCard = require('./playCard');

const START_QUERY = `UPDATE gameroom 
  SET current_turn = 1, deck=$1, current_card=$2
  WHERE id = $3
  RETURNING current_card`;

const startGame = (room_id, deck, callback) => {
  const firstCard = deck.shift();
  const VALUE = [{deck}, firstCard, room_id];
  database
    .one(START_QUERY, VALUE)
    .then(callback);
};

module.exports = startGame;