var express = require('express');
var router = express.Router();

const gameroom = require('../db/gameroom');
const isLoggedIn = require('../middleware/isLoggedIn');

router.post('/create', isLoggedIn, function(request, response) {
  gameroom.createRoom((room) => {
    gameroom.addPlayer({userId: request.user.id, roomId: room.id}, (player) => {
      console.log("Player with user id "+player.user_id+" joined a room");
      response.redirect('/gameroom/'+room.id);
    });
  });
});

router.get('/join/:id', isLoggedIn, function(request, response) {
  let room_id = request.params.id;
  console.log("Join route hit : "+room_id);
  gameroom.addPlayer({userId: request.user.id, roomId: room_id}, (player) => {
    console.log("Player with user id "+player.user_id+" joined a room");
    response.redirect('/gameroom/'+room_id);
  }).catch((error) => {
    response.redirect('/gameroom/'+room_id);
  });
})

// /* GET game room. */
// router.get('/', function(req, res, next) {
//   res.render('gameRoom', {title: "GameRoom"});
// });

router.get('/:id',function(req, res, next) {
    res.render('gameroom', {title: "Room"+req.params.id});
});

module.exports = router;
