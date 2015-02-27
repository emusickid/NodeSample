var express = require('express');
var router = express.Router();


router.get('/login', function(req, res){
	
	    
	res.render('login', {
		dashboard: 'Energy Trades',
		trading: 'Energy Trades',
		appname: 'Allegro Insight',
		title: 'Allegro Insight',
		lastname: req.params.lastname
	});
});

module.exports = router;