var express = require('express');
var router = express.Router();
const getAllRooms = require('../db/gameroom/getAllRooms');
const getScores = require('../db/user/getScores');

/* GET home page. */
router.get('/', function (request, response) {
  const room_error = { 
    message: request.query.error,
    room: request.query.id
  };
  // console.log(room_error);
  getAllRooms().then((dbRooms) => {
    getScores().then((dbScores) => {
      response.render('index', {title: 'Lobby', rooms: dbRooms, scores: dbScores, error: room_error});
    });
  });
});

module.exports = router;
