const shuffle = require('./shuffle');
const game = require('../db/game');
const player = require('../db/player');

function Card(symbol, color, action) {
  this.symbol = symbol;
  if(typeof color == 'function') {
    this.action = color;
    this.color = "";
  } else {
    this.color = color;
    this.action = action;
  }
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
  deck.push(new Card("reverse", color, function(room_id) {
    game.reverse(room_id);
  }));  

  // Skip Card
  deck.push(new Card("skip", color, function(room_id) {
    game.nextTurn(room_id); 
  }));
  // +2 Card
  deck.push(new Card("+2", color, function(room_id) {
    player.nextPlayer(function(nextPlayer) {
      player.drawCard(nextPlayer.user_id, room_id, 2);
    });
  }));

  // +4 Card
  deck.push(new Card("+4", function(room_id) {
    player.nextPlayer(function(nextPlayer) {
      player.drawCard(nextPlayer.user_id, room_id, 4);
      game.nextTurn(room_id);
    });
  }));

  // Wildcard
  deck.push(new Card("wildcard", function(game, newColor) {
    game.changeColor(newColor);
  }));      
});

shuffle(deck);
shuffle(deck);
shuffle(deck);

module.exports = deck;