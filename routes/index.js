var express    = require("express"),
	router     = express.Router(),
	passport   = require("passport"),
    User       = require("../models/User");

router.get("/",function(req,res){
	res.render("home");
});
//show signup form
router.get("/register",function(req,res){
	res.render("register");
});
//handle signup logic
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err, user){
		if(err){
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome To Destination " + user.username);
			res.redirect("/");
		});
	});
})
//show login form
router.get("/login",function(req,res){
	res.render("login");
});
//handle login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login",
}),function(req,res){
	console.log("Logged someone");
})
// handle logout logic
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out!!");
	res.redirect("/");
});

module.exports = router;