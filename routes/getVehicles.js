var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");

/* GET vehicles. */
router.post('/', function(req, res, next) {
	
	console.log('get vehicles called with ');
	// HANDLE DIFFERENT POST REQUESTS
	 if (req.body.params.type == "getVehicles"){
		console.log(" looking for user vehicles ");
	
		Vehicles.findAll({ order: [['createdAt', 'DESC']] , where: { username: req.session.username }} ).then(function(vehicles) {
				console.log(" in find user ");
				console.log("found vehicles " + JSON.stringify(vehicles) );
		
				  res.send(vehicles);
			}).catch(function(err) {
				console.log(" can't find vehicles " + err);
				res.send('error_getting_vehicles');
		  });
	}

	// GET ONLY EXPIRING VEHICLES
	 if (req.body.params.type == "getExpiringVehicles"){
		console.log(" looking for expiring vehicles ");

		var reminder = new Date();
		reminder = reminder.setMonth(reminder.getMonth() + 1) ; //set reminder to one month ago

		Vehicles.findAll({ order: [['createdAt', 'DESC']] , 
				where: { username: req.session.username,
						 $and: {
							 $or: [
								{registrationExpiresOn: { $lt: reminder }},
								{insuranceExpiresOn: { $lt: reminder }},
								{secondInsuranceExpiresOn: { $lt: reminder }},
								{cargoInsuranceExpiresOn: { $lt: reminder }},
								{techInspectionExpiresOn: { $lt: reminder }},
								{maintenanceInspectionExpiresOn: { $lt: reminder }}
							  ]
							}				
						 }} ).then(function(vehicles) {
				console.log(" in expiring vehicles ");
				console.log("found vehicles " + JSON.stringify(vehicles) );
		
				  res.send(vehicles);
			}).catch(function(err) {
				console.log(" can't find vehicles " + err);
				res.send('error_getting_vehicles');
		  });
	}

	/*
	else if (req.body.params.type == "city"){ // CITY WIDE
		console.log(" looking for local posts");
		var latitudeUser = new Number(req.body.params.latitude) ;
		var longitudeUser = new Number(req.body.params.longitude) ;
		
		console.log("latitude: " + latitudeUser);
		console.log("longitude: " + longitudeUser);
		
			Posts.findAll({ order: [['createdAt', 'DESC']] , 
			where: { latitude: {$between: [latitudeUser - 0.3, latitudeUser + 0.3 ]}, 
						longitude: {$between: [longitudeUser - 0.4, longitudeUser + 0.4 ]} }, include: [ Users] } )
					.then(function(posts) {
				console.log("found posts " + JSON.stringify(posts) );
				  res.send(posts);
			}).catch(function(err) {
				console.log(" can't find posts " + err);
				res.send('error_getting_posts');
		  });
	}*/
	
});

module.exports = router;