var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = /*process.env.DATABASE_URL ||*/ "postgres://tableau:passw0rd@54.187.16.121:8060/workgroup";;


router.get('/projects', function(req, res){

	var results = [];

    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
	    // SQL Query > Select Data
	    var sql = 
		'SELECT ' +
		   '_projects.name ' +
		'FROM ' +
		    '_sites ' +
		    'INNER JOIN _projects ON _sites.id = _projects.site_id ' +
		'WHERE ' +
		    '_sites.name = $1 ' +
		    'AND _projects.name NOT IN ($2, $3)';

		
	    var query = client.query(
			sql, ['POC', 'default', 'Tableau Samples']);

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
});

router.get('/sites', function(req, res){

	var results = [];

    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
	    // SQL Query > Select Data
	    var sql = 'SELECT name FROM _sites WHERE status = $1 AND name NOT IN ($2);'
		
		
	    var query = client.query(
			sql, ['active', 'Default']);

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
});
// router

router.get('/views/:site/:username', function(req, res){

	// console.log(req.query.username);
	var site = req.params.site;
	var username = req.params.username;

	// console.log(site);
	// console.log(username);
	var results = [];
    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
	    // SQL Query > Select Data
	    var sql = 
			'SELECT DISTINCT ' + 
				// '_sites.name AS SiteName, ' +
				// '_projects.name AS ProjectName, ' + 
				// '_workbooks.name AS WorkbookName, ' +
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
			'ORDER BY ViewName';

		   
	    var query = client.query(sql, [site, 'default', 'Tableau Samples', 'View', 'Group', username]);


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
});

module.exports = router;