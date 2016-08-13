/* MAIN BACKEND APP.JS */
var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hash = require('./routes/encode').hash;

var Sequelize = require("sequelize");
var connect = require('connect');
var http = require('http');
var session = require('express-session');
var Q = require('q');

// LOCAL DB
/*
var db = new Sequelize('vehicleManagerDB', 'root', '', { // YOU MUST FIRST CREATE A DB IN MYSQL CALLED mydbname
  host: "localhost",
  port: 3306,
  dialectOptions: {
     charset: 'utf8mb4',
     supportBigNumbers: true,
     multipleStatements: true
  }
})
*/

// jawsDB
var db = new Sequelize('idobi31oyz1y4mo8', 'n8a12symok6wklqa', 'yr9mt969d70msc0u', { // YOU MUST FIRST CREATE A DB IN MYSQL CALLED mydbname
  host: "m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  port: 3306,
  dialectOptions: {
     charset: 'utf8mb4',
     supportBigNumbers: true,
     multipleStatements: true
  }
})


 // DB TABLES DEFINITION
	Users = db.define('users', {
		  username: {
				type: Sequelize.STRING, unique: true,  primaryKey: true
		  },
			firstName: {
		  		type: Sequelize.STRING
		  },
			lastName: {
		  		type: Sequelize.STRING
		  },
		  password: {
		  		type: Sequelize.STRING
		  },	  
		  salt: {
		  		type: Sequelize.STRING
		  },
		  email: {
		  		type: Sequelize.STRING, unique: true
		  },
			info: {
		  		type: Sequelize.TEXT
		  },
			bio: {
		  		type: Sequelize.TEXT
		  },
			birthdate: {
		  		type: Sequelize.DATE
		  },
			picture: {
		  		type: Sequelize.BLOB
		  },
			language: {
		  		type: Sequelize.STRING
		  },
			proAccount:{
					type: Sequelize.STRING
			},
			trial:{
				type: Sequelize.STRING
			},
			expirationDate:{
					type: Sequelize.DATE
			},
			passwordReset:{
				 	type: Sequelize.STRING
			},
			settings: {
					type: Sequelize.TEXT
			}
		},
		{
		  freezeTableName: true // Model tableName will be the same as the model name
		});
	
		Drivers = db.define('drivers', {
		  driverId: {
			   type: Sequelize.UUID,
   			 defaultValue: Sequelize.UUIDV4,
			   primaryKey: true
		  },
		  licenseNumber: {
		  		type: Sequelize.STRING
		  },
			picture: {
		  		type: Sequelize.BLOB
		  },
			firstName: {
					type: Sequelize.STRING
			},
			lastName: {
					type: Sequelize.STRING
			},
		  email: {
		  		type: Sequelize.STRING
		  },
			phone: {
		  		type: Sequelize.STRING
		  },
			lastVehicleId: {
			  	type: Sequelize.STRING
			},
			notes: {
					type: Sequelize.TEXT
			},
			fuelLog: {
					type: Sequelize.TEXT
			},
			ssn: {
					type: Sequelize.STRING
			},
			record: {
					type: Sequelize.TEXT
			}
		},
		{
		  freezeTableName: true // Model tableName will be the same as the model name
		});

		Vehicles = db.define('vehicles', {
		  vehicleId: {
			   type: Sequelize.UUID,
   			 defaultValue: Sequelize.UUIDV4,
			   primaryKey: true
		  },
			vehicleVIN: {
				type: Sequelize.STRING
			},
			vehicleColor: {
				type: Sequelize.STRING
			},
			vehicleType:{
				type: Sequelize.STRING
			},
			vehicleMake:{
				type: Sequelize.STRING
			},
			vehicleModel:{
				type: Sequelize.STRING
			},
			vehicleYear:{
				type: Sequelize.INTEGER
			},
			vehicleDescription: {
				type: Sequelize.TEXT
			},
			odometer: {
					type: Sequelize.BIGINT
			},
			odometerUnits: {
					type: Sequelize.STRING
			},
			fuelLog:{
					type: Sequelize.TEXT
			},
			username:{
				type: Sequelize.STRING, foreignKey: true
			},
		  notes: {
		  		type: Sequelize.TEXT 
		  },
			repairLog: {
					type: Sequelize.TEXT
			},
			registeredOn:{
					type:Sequelize.DATE
			},
			registrationExpiresOn:{
					type:Sequelize.DATE
			},
			registrationMonths:{
				  type: Sequelize.INTEGER
			},
			registrationNumber: {
					type: Sequelize.STRING
		  },
			registrationPrice: {
				 type: Sequelize.INTEGER
			},
			insuredOn:{
					type: Sequelize.DATE
			},
			insuranceExpiresOn: {
		  		type: Sequelize.DATE
		  },
			insuranceMonths:{
				  type: Sequelize.INTEGER
			},
			insuranceNumber: {
				  type: Sequelize.STRING
			},
			insuranceCompany:{
 					type: Sequelize.STRING
			},
			inspurancePrice: {
				 type: Sequelize.INTEGER
			},
			secondInsuranceNumber: {
				  type: Sequelize.STRING
			},
			secondInsuranceCompany:{
 					type: Sequelize.STRING
			},
			secondInsuranceOn: {
					type: Sequelize.DATE
			},
			secondInsuranceExpiresOn: {
					type: Sequelize.DATE
			},
			secondInsuranceMonths:{
				  type: Sequelize.INTEGER
			},
			secondInspurancePrice: {
				 type: Sequelize.INTEGER
			},
			cargoInsuranceOn: {
					type: Sequelize.DATE
			},
			cargoInsuranceExpiresOn: {
					type: Sequelize.DATE
			},
			cargoInsuranceMonths:{
				  type: Sequelize.INTEGER
			},
			cargoInsuranceNumber: {
				  type: Sequelize.STRING
			},
			cargoInsuranceCompany:{
 					type: Sequelize.STRING
			},
			cargoInspurancePrice: {
				 type: Sequelize.INTEGER
			},
			techInspectionOn: {
					type:Sequelize.DATE
			},
			techInspectionExpiresOn: {
					type:Sequelize.DATE
			},
			techInspectionMonths:{
				  type: Sequelize.INTEGER
			},
			maintenanceInspectionOn:{
					type:Sequelize.DATE
			},
			maintenanceInspectionExpiresOn:{
					type:Sequelize.DATE
			},
			maintenanceInspectionMonths:{
				  type: Sequelize.INTEGER
			},
		  palets: {
					type: Sequelize.BIGINT, defaultValue: 0
		  },
		  areaCode: {
					type: Sequelize.STRING
		  },
		  country: {
					type: Sequelize.STRING
		  },
		  latitude: {
					type: Sequelize.STRING
		  },
		  longitude: {
					type: Sequelize.STRING
		  },
		  altitude: {
		  		type: Sequelize.STRING
		  },
		  picture: {
		  		type: Sequelize.BLOB
		  },
		  video: {
		  		type: Sequelize.BLOB
		  },
		  audio: {
		  		type: Sequelize.BLOB
		  },
			lastDriverId:{
				type: Sequelize.STRING
			},
			activeStatus: {
				type: Sequelize.STRING
			},
			totalCost:{
				type: Sequelize.BIGINT
			}
		},
		{
		  freezeTableName: true // Model tableName will be the same as the model name
		});
					
	Users.hasMany(Vehicles, {foreignKey: 'username'});
	Vehicles.belongsTo(Users, {foreignKey: 'username'});

	db.sync(); 
 		
// routes
var routes = require('./routes/index');
var signUp = require('./routes/signUp');
var socialLogin = require('./routes/socialLogin');
var addVehicle = require('./routes/addVehicle');
var getVehicles = require('./routes/getVehicles');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var corsOptions = {
  origin: 'https://balog.herokuapp.com',
	credentials: true,
	maxAge: 36000
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // cors pre-flight

app.use(session({
  resave: true, 
  saveUninitialized: true,
  secret: 'something_very_secret',
  cookie : { secure : false, 
						 maxAge : (10 * 365 * 24 * 60 * 60 * 1000),
						 httpOnly : false
					  } // 10 yrs
}));

app.use(express.static(path.join(__dirname, 'public')));

// Session-persisted message middleware
app.use( cors(corsOptions), function(req, res, next){

  req.db = db;
  next(); 
});

app.use('/', routes);
app.use('/signUp', signUp);
app.use('/socialLogin', socialLogin);
app.use('/addVehicle', addVehicle);
app.use('/getVehicles', getVehicles);

app.post('/logout', function (req,res){

	req.session.user = null ;
				
	req.session.destroy(function(err) {
  		// cannot access session here
		console.log("logging out user.");
		res.send('logged out.');
	});
});

app.post('/checkSession', function(req, res){
	console.log(" in the session function ");
	
	if ( req.session && req.session.user ){ // ALREADY LOGGED IN
			res.send(req.session.username);
			return "SESSION_ACTIVE" ;
	}
	else{
		console.log('session does not exist');
		res.send('LOGIN_FAIL');
	}
});

app.post('/login', function(req, res){
	console.log(" in the login function ");
	
	var email =  req.body.params.email.toLowerCase();
			
    authenticate(req, email, req.body.params.password, function(err, user){
  
			console.log(" after auth function ");
			if (user) {
	
				console.log(" login > user ");
			  // Regenerate session when signing in
			  // to prevent fixations
			   req.session.regenerate(function(){
				// Store the user's primary key
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.user = user;
				req.session.username = req.body.params.username;
		  
				console.log(" saving session user " + req.session.username);
				res.send(req.session.username);
			  });
			} else {
		
			  console.log(" throwing error, user not found ");

			  res.send('LOGIN_FAIL');
			}
  });
});

function authenticate(req, email, password, fn) {

	console.log(" auth with:" + email + ": , " + password);
		
		Users.findOne({
			  where: {email: email}
			}).then(function(user) {
			
			  if (!user){
				console.log("cannot find user");
				return fn(new Error('cannot find user'));
			  }
	   
		hash(password, user.salt, function(err, hash){
			if (err) return fn(err);
		
			if (hash == user.password) {
				console.log(" hash = user passcode");
				 return fn(null, user);
			}

			fn(new Error('invalid password'));
	  
		  });
	}).catch(function(error) {
		console.log(" cannot find user " + error);
		return fn(new Error('cannot find user'));
		
		});	

	console.log(" end of auth fn ");
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;