var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = /*process.env.DATABASE_URL ||*/ "postgres://tableau:passw0rd@54.187.16.121:8060/workgroup";;



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

	var results = [];

    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
        // SQL Query > Select Data
        var query = client.query('SELECT DISTINCT ' + 
    '_sites.name AS SiteName, ' +
    '_projects.name AS ProjectName, ' + 
    '_workbooks.name AS WorkbookName, ' +
    '_views.name AS ViewName, ' +
    '_views.view_url AS ViewURL ' +
'FROM ' +
    '_sites ' +
    'INNER JOIN _projects ON _sites.id = _projects.site_id ' +
    'INNER JOIN _workbooks ON _projects.id = _workbooks.project_id ' +
    'INNER JOIN _views ON _workbooks.id = _views.workbook_id ' +
    'INNER JOIN next_gen_permissions perm ON _views.id = perm.authorizable_id ' +
    'INNER JOIN _groups ON perm.grantee_id = _groups.id ' +
    'INNER JOIN group_users ON _groups.id = group_users.group_id ' +
    'INNER JOIN _users ON group_users.user_id = _users.id ' +
'WHERE ' +
    '_sites.name = $1 ' +
    'AND _projects.name NOT IN ($2, $3) ' +
    'AND perm.authorizable_type = $4 ' +
    'AND perm.grantee_type = $5 ' +
    'AND _users.name = $6 ' +
'ORDER BY ViewName', ['POC', 'default', 'Tableau Samples', 'View', 'Group', 'poc_agusa']);


        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });

	// 	res.render('index', {
	// 	dashboard: 'Energy Trades'
	// })
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







