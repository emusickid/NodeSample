var express = require('express');
var router = express.Router();

var cassandra = require('cassandra-driver');
var uuid = require('node-uuid');


exports.runQuery = function(query, params){
	var client = new cassandra.Client({contactPoints: ['52.11.54.138'], keyspace: 'demo'});

	client.execute(query, params, {prepare: true}, function (err, result) {
           // console.log(err); 
    });
}

module.exports = router;