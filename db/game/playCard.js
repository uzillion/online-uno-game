const database = require('../index');

const PLAY_CARD_QUERY = `UPDATE gameroom 
  SET current_card = $1, 
  WHERE id = $2`;

const playCard = (room_id, card) => {
  const VALUE = [card, room_id];
  database
    .query(PLAY_CARD_QUERY, VALUE);
};

module.exports = playCard;