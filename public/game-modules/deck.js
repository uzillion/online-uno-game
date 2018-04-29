import { builtinModules } from "module";

function Card(symbol, color, action) {
  this.symbol = symbol;
  this.color = color;
  this.action = action;
}

const deck = [];
const colors = ["red", "blue", "green", "yellow"];
colors.forEach(function(color) {
  
  // Storing number cards from 1 to 9.
  for(let i = 1 ; i < 10 ; i++) {

    deck.push(new Card(`${i}`, color, null));
    deck.push(new Card(`${i}`, color, null));

  }

  // 0 card
  deck.push(new Card("0", color, null));  

  // Reverse Card
  deck.push(new Card("reverse", color, function(game) {
    game.reverse();
  }));  

  // Skip Card
  deck.push(new Card("skip", color, function(player) {
    player.nextPlayer(function(nextPlayer) {
      nextPlayer.skip();
    });
  }));  

  // +2 Card
  deck.push(new Card("+2", color, function(player) {
    player.nextPlayer(function(nextPlayer) {
      nextPlayer.draw();
      nextPlayer.draw();
    });
  }));

  // +4 Card
  deck.push(new Card("+4", null, function(player) {
    player.nextPlayer(function(nextPlayer) {
      nextPlayer.draw();
      nextPlayer.draw();
      nextPlayer.draw();
      nextPlayer.draw();
      nextPlayer.skip();
    });
  }));

  // Wildcard
  deck.push(new Card("wildcard", null, function(game, newColor) {
    game.changeColor(newColor);
  }));      
});

module.exports = deck;