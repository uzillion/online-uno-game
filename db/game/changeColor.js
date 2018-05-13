const database = require('../index');

const GET_CURRENT_CARD_QUERY = `SELECT current_card FROM gameroom
  WHERE id=$1`;

const UPDATE_CURRENT_CARD_QUERY = `UPDATE gameroom
  SET current_card = $1
  WHERE id = $2`;

const changeColor = (room_id, newColor) => {
    // console.log("New Color: "+newColor);
    return database.query(UPDATE_CURRENT_CARD_QUERY, [{symbol: "", color: newColor}, room_id])
    .then(()=>{console.log("Done changing color");})
    .catch(error => {console.log("In changeColor.js: "+error)});
    // .one(GET_CURRENT_CARD_QUERY, room_id)
    // .then((card) => {
    //   let current_card = card.current_card;
    //   current_card.color = newColor;
    //   database.query(UPDATE_CURRENT_CARD_QUERY, [current_card, room_id]);
    // });
};

module.exports = changeColor;