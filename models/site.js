function getSites(){
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
        	// console.log(row);
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            // console.log(results);
           // return results;
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }
    });
    console.log(results);
    return results;
}
exports.getSites = getSites;