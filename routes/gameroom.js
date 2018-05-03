var express = require('express');
var router = express.Router();

const gameroom = require('../db/gameroom');
const game = require('../db/game');
const deck = require('../game_modules/deck');
const validateCard = require('../game_modules/validate_card');
const player = require('../db/player');

const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/create', isLoggedIn, function(request, response) {
  gameroom.createRoom((room) => {
    gameroom.addPlayer({userId: request.user.id, roomId: room.id, turn: room.n_players+1}, (player) => {
      console.log("Player with user id "+player.user_id+" joined a room");
      response.redirect('/gameroom/'+room.id);
    });
  });
});

router.get('/join/:id', isLoggedIn, function(request, response) {
  const room_id = request.params.id;
  gameroom.getRoom(room_id, (room) => {
    console.log(room);
    if(room.n_players == null) {
      response.redirect('/?error=doesNotExist&id='+room_id);      
    }else if(room.n_players < 4) {
      gameroom.addPlayer({userId: request.user.id, roomId: room_id, turn: room.n_players+1}, (player) => {
        console.log("Player with user id "+player.user_id+" joined room "+ player.room_id);
        response.redirect('/gameroom/'+room_id);
      });
    } 
    else if(room.n_players == 4) {
      response.redirect('/?error=roomFull&id='+room_id);
    }
    else {
      response.redirect('/?error=unknownError');
    }
  });
  // .catch((error) => {
  //   response.redirect('/gameroom/'+room_id);
  // });
});

router.post('/leave/:id', isLoggedIn, function(request, response) {
  // console.log(request.body.roomId);
  gameroom.removePlayer({userId: request.user.id, roomId: parseInt(request.params.id)});
  response.redirect("/");
});



//################## Replaced with socket signals ####################

// router.post('/start/:id', isLoggedIn, function(request, response) {
//   const room_id = request.params.id;
//   game.startGame(room_id, deck, function(firstCard) {
//     gameroom.getPlayers(room_id, function(players) {
//       players.forEach(function(roomPlayer) {
//         player.drawCard(roomPlayer.user_id, room_id, 7);
//       });
//       response.status(200).json(firstCard);
//     });
//   });
// });

// router.post('/play/:id', isLoggedIn, function(request, response) {
  //   const playingCard = request.body.card;
//   const room_id = request.params.id;
//   const user_id = request.user.id;
  
//   validateCard(user_id, room_id, playingCard, function(result, error) {
//     if(result == true)
//       player.playCard(request.params.id, request.user.id, request.body.card);
//     else
//       response.redirect('/room_id?error='+error)
//   });

// });

// router.post('/change-color/:id', isLoggedIn, function(request, response) {
//   game.changeColor(request.params.id, request.body.color);
// })

router.get('/:id', isLoggedIn, function(request, response, next) {
    const room_id = request.params.id;
    gameroom.getRoom(room_id, function(room) {
      response.render('gameroom', {title: "Room "+room_id, id: room_id});
    })
});

module.exports = router;
