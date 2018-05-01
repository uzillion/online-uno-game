const database = require('../index');

const GET_HAND_QUERY = `SELECT hand from player 
  WHERE user_id = $1 and room_id = $2`;

const GET_DECK_QUERY = `SELECT deck from gameroom
  WHERE id = $1`;

const UPDATE_HAND_QUERY = `UPDATE player
  SET hand = $1
  WHERE user_id = $2 and room_id = $3`;

const UPDATE_DECK_QUERY = `UPDATE gameroom
  SET deck = $1
  WHERE id = $2`;

const drawCard = (user_id, room_id, num) => {
  return database
    .one(GET_DECK_QUERY, room_id)
    .then((data) => {
      // console.log("====1=====");
      const deck = data.deck.deck;
      // console.log(gameDeck.shift());
      return deck;
    }).then((deck)=>{
      // console.log("====2=====");      
      // console.log("DECK: "+JSON.stringify(deck[0]));
      const drawnCards = [];
      for(let i = 1; i<=num; i++) {
        drawnCards.push(deck.shift());
      }
      database.query(UPDATE_DECK_QUERY, [{deck}, room_id]);
      return drawnCards;
    }).then((drawnCards)=> {
      // console.log("====3=====");           
      database
        .one(GET_HAND_QUERY, [user_id, room_id])
        .then((data) => {
          // console.log("====4=====");          
          // console.log(data); 
          let cards = data.hand.cards;
          cards = cards.concat(drawnCards);
          // cards.forEach((card)=> {
            // console.log(user_id + " gets " + JSON.stringify(card));
          // });       
          // console.log(drawnCards);
          return cards;
        }).then((cards)=>{
          // console.log("====5=====");
          database
            .query(UPDATE_HAND_QUERY, [{cards}, user_id, room_id]);
        });
    });
};

module.exports = drawCard;