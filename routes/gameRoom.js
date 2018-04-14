var express = require('express');
var router = express.Router();

/* GET game room. */
router.get('/', function(req, res, next) {
  res.render('gameRoom', {title: "GameRoom"});
});

router.get('/:id',function(req, res, next) {
    res.send(req.params.id);
});

module.exports = router;
