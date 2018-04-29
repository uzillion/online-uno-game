var express = require('express');
var router = express.Router();
const getAllRooms = require('../db/gameroom/getAllRooms');
const getScores = require('../db/user/getScores');

/* GET home page. */
router.get('/', function (request, response) {
  const error = request.query.error;
  console.log(error);
  getAllRooms(function(dbRooms) {
    getScores((dbScores) => {
      response.render('index', {title: 'Lobby', rooms: dbRooms, scores: dbScores, message: error});
    });
  });
});

module.exports = router;
