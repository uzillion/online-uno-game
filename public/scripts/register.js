let pass, repass, email;
const emailEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const usernameEx = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){3,24}$/;
let cond_username, cond_email, cond_pass;

// $("input[type='submit']").attr("disabled", "disabled");

function formError(element, error) {
	element.toggleClass("is-invalid");
	if(element.hasClass("is-invalid")) {
		$("input[type='submit']").attr("disabled", "disabled");
    $("#error").append(error);
	} else {
		$("input[type='submit']").removeAttr("disabled");
    $("#error").empty();
	}
}

$("input").keyup(function() {
	pass = $("input[name='password']").val();
	cpass = $("input[name='cpassword']").val();
	email = $("input[name='email']").val();
	usrnm = $("input[name='username']").val();

	if(!usernameEx.test(usrnm) && usrnm!="") {
		if(!($("#username").hasClass("is-invalid"))) {
			formError($("#username"), "username needs to be atleast 4 characters long");
		}
	} else {
		if($("#username").hasClass("is-invalid")) {
			formError($("#username"));
		}
	}

	if(!emailEx.test(email) && email!="") {
		if(!($("#email").hasClass("is-invalid"))) {
			formError($("#email"), "Not a valid email format");
		}
	} else {
		if($("#email").hasClass("is-invalid")) {
			formError($("#email"));
		}
	}

  if(pass.length < 6 && pass!="") {
    if(!($("#pass").hasClass("is-invalid"))) {
      formError($("#pass"), "Needs to be atleast 6 characters long");
    }
  } else if(!$("#cpass").is(":focus")){
    if($("#pass").hasClass("is-invalid")) {
      formError($("#pass"));
    }
  }

	if(pass != cpass && cpass!="") {
		if(!($("#pass").hasClass("is-invalid"))) {
			formError($("#pass"));
			formError($("#cpass"), "Passwords do not match");
		}
	} else if(cpass!=""){
		if($("#pass").hasClass("is-invalid")) {
			formError($("#pass"));
			formError($("#cpass"));
		}
}
});
