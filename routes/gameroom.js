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
  const room_id = request.params.id;
  gameroom.getRoom(room_id, (room) => {
    if(room.n_players < 4) {
      gameroom.addPlayer({userId: request.user.id, roomId: room_id}, (player) => {
        console.log("Player with user id "+player.user_id+" joined room "+ player.room_id);
        response.redirect('/gameroom/'+room_id);
      });
    } else {
      response.redirect('/?error=roomfull');
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

// /* GET game room. */
// router.get('/', function(req, res, next) {
//   res.render('gameRoom', {title: "GameRoom"});
// });

router.get('/:id', isLoggedIn, function(req, res, next) {
    const room_id = req.params.id;
    res.render('gameroom', {title: "Room "+room_id, id: room_id});
});

module.exports = router;
