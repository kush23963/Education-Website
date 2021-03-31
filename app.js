const bodyParser     = require("body-parser"),
	express          = require("express"),
	app              = express(),
	mongoose         = require("mongoose"),
	request          = require("request"),
	requestP         = require("request-promise"),
	flash            = require("connect-flash"),
	LocalStrategy    = require("passport-local"),
	passport   	     = require("passport"),
	methodOverride   = require('method-override'),
	axios            = require('axios'),
	cheerio          = require('cheerio'),
	User             = require("./models/User");

//requiring route
var	indexRoute      = require("./routes/index");
var url = process.env.DATABASEURL||"mongodb://localhost/try_app"
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://Kush:handsome@mywebsite.rftay.mongodb.net/mywebsite?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(flash());

// 
//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret:"Kush is the handsome and intelligent boy of the earth",
		resave:false,
		saveUninitialized:false,
	}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.get("/result", (req,res)=> {
	var query = req.query.search;
	var clientId = "yPzJhLUDbdpgj5riyfVDuBJaEeuSM0PhX3cBd7gZ";
	var clientSecret = "eI3TmDXID2niVB3eYN5hdinu5zHq3kloGKciYBGJ7g1xxviygMsmMRfRdKKimSodZBXa0xZzyrXObZm10YgR4BP1BAA4793hQj0exF1xx3ZJx9rA6QIBDezj7I4IfmxY";
	var encodedData = Buffer.from(clientId + ':' + clientSecret).toString('base64');   
	requestP.get({
	   uri: "https://www.udemy.com/api-2.0/courses/?search=" + query,
	   headers: {
	      'Authorization': 'Basic ' + encodedData
	   },
	   json: true
	})
	.then((jsonData)=> {
	    res.render("result", {data : jsonData, course:query});  
	})
	.catch((error)=> {
		console.log("Error!",error);
	});	
});

//About Route
app.get("/about",function(req,res){
	res.render("about");	
});
app.get("/search",function(req,res){
	res.render("search");	
});

app.use("/",indexRoute);
app.listen(process.env.PORT || 8017,function(){
	console.log("You can do this..")
});