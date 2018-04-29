var express = require('express');
var router = express.Router();
const getAllRooms = require('../db/gameroom/getAllRooms');

/* GET home page. */
router.get('/', function (request, response) {
  const error = request.query.error;
  console.log(error);
  getAllRooms(function(dbRooms) {
    response.render('index', {title: 'Lobby', rooms: dbRooms, message: error});
  })
});

module.exports = router;
