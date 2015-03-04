var express = require('express');
var router = express.Router();

var cassandra = require('cassandra-driver');
var uuid = require('node-uuid');


router.post('/new', function(req, res){
	var client = new cassandra.Client({contactPoints: ['52.11.54.138'], keyspace: 'demo'});
	 
	var query = "INSERT INTO users (id, lastname, age, city, email, firstname) VALUES (?, ?, 35, 'Austin', 'bob@example.com', 'Bob')";
	var params = [uuid.v1(), req.params.lastname];

	client.execute(query, params, {prepare: true}, function (err, result) {
           // console.log(err); 
    });

    res.statusCode = 200;



    res.send('Added new user!!!');
});

router.get('/', function(req, res){
	
	// var client = new cassandra.Client({contactPoints: ['52.11.54.138'], keyspace: 'demo'});
	 
	// var query = "INSERT INTO users (id, lastname, age, city, email, firstname) VALUES (?, ?, 35, 'Austin', 'bob@example.com', 'Bob')";
	// var params = [uuid.v1(), req.params.lastname];

	// client.execute(query, params, {prepare: true}, function (err, result) {
 //            console.log(err); 
 //    });
    
	// res.render('index', {
	// 	dashboard: 'Energy Trades',
	// 	trading: 'Energy Trades',
	// 	appname: 'Allegro Insight',
	// 	title: 'Allegro Insight',
	// 	lastname: req.params.lastname
	// });

	var RestClient = require('node-rest-client').Client;

	args = {
		headers:{"X-Tableau-Auth": "e587888212cda7bb6899a89d21fa0100"}
	};

	restClient = new RestClient();
	restClient.get("http://ec2-54-187-16-121.us-west-2.compute.amazonaws.com/api/2.0/sites",args, function(data, response){
            // parsed response body as js object 
            // console.log(data);

           	// var sites = data.sites;

           	console.log(data.tsResponse.sites[0].site);

            // raw response 
            // console.log(response);

   //          for (var key in data) {
			//   if (data.hasOwnProperty(key)) {
			//     console.log(key);
			//   }
			// }
        });
});

router.get('/login', function(req, res){
	
	    
	res.render('login', {
		dashboard: 'Energy Trades',
		trading: 'Energy Trades',
		appname: 'Allegro Insight',
		title: 'Allegro Insight',
		lastname: req.params.lastname
	});
});

router.post('/addlogin', function(req, res){
	
  	console.log(req.body);  
	  	
	var query = "INSERT INTO users (id, email, password) VALUES (?, ?, ?)";
	var params = [uuid.v1(), req.params.email, req.params.password];

	console.log(params);

	dataAccess.runQuery();
});

// router

module.exports = router;







