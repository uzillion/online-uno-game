var express = require('express');
var router = express.Router();
const passport	= require("passport");
// const addUser = require("../db/user/addUser");
var bcrypt = require('bcrypt');
const saltRounds = 10;


// router.get("/:id", function(req, res) {
//   res.render("profile", {title: "Profile"});
// });


//Registration routes
router.get("/register", function(req, res) {
	res.render("register", {title: 'Register'});					//views/users/register.ejs
});

router.post("/register", function(req, res) {
	var emailEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var usernameEx = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){4,24}$/;
	if(emailEx.test(req.body.email) && usernameEx.test(req.body.username)) {
    var hashedPass;
    console.log(req.body.password);
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(!err) {
        // addUser({username: req.body.username, password: hash, email: req.body.email, privilege: 1});
      }
      else {
        console.log("bcrypt error:"+err);
      }
    });
    res.redirect("/user/login");
	} else {
		res.redirect("/");
	}
});

router.get("/login", function(req, res) {
	res.render("login", {title:"login"});					//views/users/login.ejs
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
		failureRedirect: "/user/login"
}), function(req, res) {});

//Logout route
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

module.exports = router;
