const database = require('../index');
const playCard = require('./playCard');

const START_QUERY = `UPDATE gameroom 
  SET current_turn = 1, deck=$1, current_card=$2
  WHERE id = $3`;

const GET_PLAYERS_QUERY = `SELECT * FROM player`;

const UPDATE_HAND_QUERY = `UPDATE player
  SET hand = $1
  WHERE user_id = $2 and room_id = $3`;

const startGame = (room_id, deck, callback) => {
  
  const firstCard = deck.shift();  
  
  database.many(GET_PLAYERS_QUERY)
  .then((players) => {
    let hand = []; 
    players.forEach((player) => {
      for(let i = 0 ; i < 7 ; i++ ) {
        hand.push(deck.shift());
      }
      database.query(UPDATE_HAND_QUERY, [{hand}, player.user_id, room_id]);
      hand = [];
    });
  }).then(()=> {
    const VALUE = [{deck}, firstCard, room_id];
    database.query(START_QUERY, VALUE)
    .then(() => {console.log("Game Started!!"); callback(firstCard)});
  });
};

module.exports = startGame;