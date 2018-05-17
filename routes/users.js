var express = require('express');
var router = express.Router();
const passport	= require("passport");
// const addUser = require("../db/users/addUser");
var bcrypt = require('bcrypt');
const saltRounds = 10;

const users = require('../db/user');

//Registration routes
router.get("/register", function(request, response) {
  let regError = request.query.error;
  console.log("hello");
  console.log(regError);
	response.render("register", {title: 'Register', error: regError});					//views/users/register.ejs
});

router.post("/register", function(request, response) {
	const emailEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const usernameEx = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){3,24}$/;
  const username = request.body.username;
  const email = request.body.email;
	if(emailEx.test(email) && usernameEx.test(username)) {
    users.getUsers().then((users) => {
      let username_exist_test = users.findIndex( x => x.username == username);
      let email_exist_test = users.findIndex( x => x.email == email);
      if(username_exist_test == -1 && email_exist_test == -1) {
        bcrypt.hash(request.body.password, saltRounds, function(err, hash) {
          if(!err) {
            addUser({username: username, password: hash, email: email});
          } else {
            console.log("bcrypt error:"+err);
          }
        });
        response.redirect("/user/login");
      } else if(username_exist_test != -1) {
        response.redirect("/user/register?error=nameexists");
      } else if(email_exist_test != -1) {
        response.redirect("/user/register?error=emailexists");
      }
    });
  } else {
    response.redirect("/");
  } 
});

router.get("/login", function(request, response) {
	response.render("login", {title:"login", error: request.query.error});					//views/users/login.ejs
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
		failureRedirect: "/user/login?error=invalid"
}), function(request, response) {});

//Logout route
router.get("/logout", function(request, response) {
	request.logout();
	response.redirect("/");
});

module.exports = router;
