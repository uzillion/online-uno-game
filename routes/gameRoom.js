var express = require('express');
var router = express.Router();

/* GET game room. */
router.get('/:id', function(req, res, next) {
	console.log(req.params.id);
  res.render('gameRoom', {title: "GameRoom"});
});

module.exports = router;
