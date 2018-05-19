const getHands = require('../db/gameroom/getHands');

const calcScore = (room_id) => {
  let score = 0;
  return getHands(room_id).then((data) => {
    // console.log(JSON.stringify(data));
    data.forEach((handData) => {
      handData.hand.hand.forEach((card) => {
        if(!isNaN(parseInt(card.symbol))) {
          score += parseInt(card.symbol); 
        } else {
          score += 20;
        }
      });
    });
    return score; 
  });
}

module.exports = calcScore;