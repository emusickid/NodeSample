var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = /*process.env.DATABASE_URL ||*/ "postgres://tableau:passw0rd@devsqltest:8060/workgroup";;
var username = process.env.USERNAME;
var config = require('config');

router.get('/', function(req, res){

    getSites(function(results){
		//res.send(results);

		res.render('siteInfo', {
			sites : results,
            appname: 'Allegro Insight'
		});
	});
});
 
router.get('/index/:site', function(req, res){

    getProjectView(req.params.site, function(results){

      // res.send(results);
        res.render('index', {
            appname: 'Allegro Insight',
            projects: results,
            site: req.params.site,
            host: config.get('Environment.host')
        });
    });
});

function getSites(callback){
	var results = [];

    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
	    // SQL Query > Select Data
	    var sql = 'SELECT name FROM _sites WHERE status = $1 AND name NOT IN ($2) ORDER BY name;'
		
		
	    var query = client.query(
			sql, ['active', 'Default']);

        // Stream results back one row at a time
        query.on('row', function(row) {
        	// console.log(row);
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            //console.log(results);
           callback(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }
    });
}
function getProjectView(site, callback){

    var projects = [];

    // Get a Postgres client from the connection pool
    var client = new pg.Client(connectionString);

    client.connect(function(err) {
		
	    // SQL Query > Select Data
	    var sql = 'SELECT DISTINCT ' +
					    '_projects.name AS ProjectName,' +
					    '_views.name AS ViewName ,' +
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
                        'ORDER BY 1;'
		
	    var query = client.query(sql, [site, 'default', 'Tableau Samples', 'View', 'Group', username]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            

            var match = false;
            var urlPrefix = site + '/views/';
            var thumbUrlPrefix = site + '/thumb/views/';

            var projectName = row.projectname;
            var viewName = row.viewname;
            var pattern = /^[0-9]_/;

            if(pattern.test(projectName)){
                 projectName = projectName.substring(2, projectName.length);
            }
            if(pattern.test(viewName)){
                 viewName = viewName.substring(2, viewName.length);
            }

            for(var i =0 ; i< projects.length; i++){

                if(projects[i].name === projectName){
                    projects[i].views.push({viewname: viewName, viewurl: urlPrefix + row.viewurl, thumburl: thumbUrlPrefix + row.viewurl});
                    match = true;
                }
            }
        	
            if(!match){
                var newProject = {};
                newProject.name = projectName;
                newProject.views = [ {viewname: viewName, viewurl: urlPrefix + row.viewurl, thumburl: thumbUrlPrefix + row.viewurl}];
                projects.push(newProject);
            }

        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            callback(projects);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }
    });
}

module.exports = router;