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

router.get('/users/:lastname', function(req, res){
	
	var client = new cassandra.Client({contactPoints: ['52.11.54.138'], keyspace: 'demo'});
	 
	var query = "INSERT INTO users (id, lastname, age, city, email, firstname) VALUES (?, ?, 35, 'Austin', 'bob@example.com', 'Bob')";
	var params = [uuid.v1(), req.params.lastname];

	client.execute(query, params, {prepare: true}, function (err, result) {
            console.log(err); 
    });
    
	res.render('index', {
		dashboard: 'Energy Trades',
		trading: 'Energy Trades',
		appname: 'Allegro Insight',
		title: 'Allegro Insight',
		lastname: req.params.lastname
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

// router

module.exports = router;







