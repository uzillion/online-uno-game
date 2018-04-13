var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
/*  res.render('login', { title: 'Login Page' });  */
           res.send("this will be the login page");
});

module.exports = router;
