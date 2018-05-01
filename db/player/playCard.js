const database = require('../index');

const GET_HAND_QUERY = `SELECT hand FROM player 
  WHERE user_id = $1 and room_id = $2`;

const UPDATE_HAND_QUERY = `UPDATE player
  SET hand = $1
  WHERE user_id = $2 and room_id = $3`;

const UPDATE_CURRENT_CARD_QUERY = `UPDATE gameroom
  SET current_card = $1
  WHERE id = $2`;

const playCard = (room_id, user_id, playedCard) => {
  database
    .one(GET_HAND_QUERY, [user_id, room_id])
    .then((hand) => {
      // console.log(hand.hand);
      let cards = hand.hand.cards;
      let index = cards.findIndex(x => x.symbol == playCard.symbol && x.color == playedCard.color);
      let current_card = cards.splice(index, 1);
      database.query(UPDATE_CURRENT_CARD_QUERY, [current_card[0], room_id]);
      return cards;
    })
    .then((cards) => {
      database.query(UPDATE_HAND_QUERY, [{cards}, user_id, room_id])
    });
};

module.exports = playCard;