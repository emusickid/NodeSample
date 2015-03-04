var express = require('express');
var router = express.Router();
var dataAccess = require('../helpers/dataAccess.js');
var bodyParser = require('body-parser');


router.get('/login', function(req, res){
	
		    
	res.render('login', {
		dashboard: 'Energy Trades',
		trading: 'Energy Trades',
		appname: 'Allegro Insight',
		title: 'Allegro Insight',
		lastname: req.params.lastname
	});
});

router.post('/execLogin', function(req, res){

	console.log('got here');

	var email = req.body.txtFolderName;
	console.log(email);
	inputEmail
	var query = "INSERT INTO users (id, email, password) VALUES (?, ?, ?");
	var params = [req.params.id, req.params.email, req.params.lastname];
	dataAccess.runQuery();
});

module.exports = router;