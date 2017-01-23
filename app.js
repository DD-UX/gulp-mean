// =================================================================
// Get all the packages ============================================
// =================================================================
var config = require('./config');
var public = config.publicUrl;

// Express
var express             = require('express');
var mongoose            = require('mongoose');
var bodyParser          = require('body-parser');
var expressValidator    = require('express-validator');

// Routes
var routes  = require('./api/routes/routes');
var api     = express.Router();

// =================================================================
// Config ==========================================================
// =================================================================

// Server configurations
var port    = process.env.PORT || 4567;
var app     = express();

if ( process.env.NODE_ENV === 'development' ){
	app.use(require('connect-livereload')({
	    port: 35729,
	    ignore: ['.map']
	}));	
}

// Use bluebird for Mongoose promises
mongoose.Promise = require('bluebird');

// app use
app.use(express.static(public));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

// Register API Routes
app.use('/api', api);

// Development environment middleware for API
if ( process.env.NODE_ENV === 'development' ){
    api.use(function(req, res, next){
        console.log("API in action!");
        next();
    });
}


// APP
//-----------------------------------
    // Root 
    app
        .get('/', function(req, res){
            res.sendFile(public + 'index.html');
        });

// API routes
//-----------------------------------
    // Form handler
    api
        .post('/form/send', routes.setFormMail);


// SERVER init
//-----------------------------------
app.listen(port, function() {
	console.log("Running the app in " + process.env.NODE_ENV + " mode");
    console.log('Server up and running!');		
});















