const shuffle = require('./shuffle');

function Card(symbol, color) {
  this.symbol = symbol;
  this.color = color;
}

const deck = [];
const colors = ["red", "blue", "green", "yellow"];
colors.forEach(function(color) {
  
  // Storing number cards from 1 to 9.
  for(let i = 1 ; i < 10 ; i++) {

    deck.push(new Card(`${i}`, color));
    deck.push(new Card(`${i}`, color));

  }

  // 0 card
  deck.push(new Card("0", color));  

  // Reverse Card
  deck.push(new Card("reverse", color));  

  // Skip Card
  deck.push(new Card("skip", color));
  // +2 Card
  deck.push(new Card("d2", color));

  // +4 Card
  deck.push(new Card("d4", "none"));

  // Wildcard
  deck.push(new Card("wildcard", "none"));      
});

for(let i = 1 ; i <= 10 ; i++) {
  shuffle(deck);
}

module.exports = deck;