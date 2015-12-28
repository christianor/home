var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var mongoUser = 'admin';
var mongoPassword = '_aakgdPANeUP';
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT;

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


app.get('/', function (req, res) {
  res.send('demo');
});

app.get('/api/messungen', function (req, res) {
	MongoClient.connect("mongodb://" + mongoHost + ":" + mongoPort + "/home", function(err, db) {
	  if (err) { 
	  	res.send(err);
	  	return console.dir(err); 
	  }

	  var collection = db.collection('messungen');
	  collection.find().toArray().toArray(function (err, items) {
  		if (err) { 
  			res.send(err);
  			return console.dir(err); 
  		}

  		res.send(items);
	  });

	});
});

var server = app.listen(server_port, server_ip_address, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Started at http://%s:%s', host, port);
});
