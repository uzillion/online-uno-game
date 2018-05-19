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
  return database
    .one(GET_HAND_QUERY, [user_id, room_id])
    .then((dbHand) => {
      // console.log("Played Card: "+JSON.stringify(playedCard));
      let hand = dbHand.hand.hand;
      // console.log(hand);
      let index = hand.findIndex(x => x.symbol == playedCard.symbol && x.color == playedCard.color);
      // console.log(hand[index]);
      let current_card = hand.splice(index, 1);
      // console.log("spliced: "+JSON.stringify(current_card));
      return database.query(UPDATE_CURRENT_CARD_QUERY, [current_card[0], room_id])
        .then(() => {
          return database.query(UPDATE_HAND_QUERY, [{hand}, user_id, room_id])
          .then(() => {return current_card[0];})
          .catch(error => {console.log("In playCard.js: "+error.stack)});
        }).catch(error => {console.log("In playCard.js: "+error.stack)});
    }).catch(error => {console.log("In playCard.js: "+error.stack)});
    
};

module.exports = playCard;