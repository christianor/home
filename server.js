var express = require('express');
var app = express();
var cors = require('cors');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
var dirname = process.env.OPENSHIFT_REPO_DIR || __dirname;
app.use('/', express.static(dirname + '/webinterface/dist'));

var MongoClient = require('mongodb').MongoClient;
var mongoUser = 'admin';
var mongoPassword = '_aakgdPANeUP';
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
var connString = "mongodb://" + mongoUser + ":" +  mongoPassword + "@" + mongoHost + ":" + mongoPort + "/home";

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


app.get('/', function (req, res) {
  res.send('demo');
});

app.get('/api/messungen', function (req, res) {
	MongoClient.connect(connString, function(err, db) {
	  if (err) { 
	  	res.status(500).send(err);
	  	return console.dir(err); 
	  }

	  var collection = db.collection('messungen');
	  collection.find({ zeit: { $gte: new Date(new Date().getTime() - 1000 * 60 * 60) } }).toArray(function (err, items) {
  		if (err) { 
  			res.status(500).send(err);
  			return console.dir(err); 
  		}

  		db.close();
  		res.send(items);
	  });

	});
});

app.post('/api/messungen', function (req, res) {
	// validate that at least temperature is there
	if (!req.body.hasOwnProperty('temperatur') || !req.body.hasOwnProperty('zeit')) {
		res.sendStatus(400);
		return;
	}

	req.body.zeit = new Date(req.body.zeit);

	MongoClient.connect(connString, function(err, db) {
	  if (err) { 
	  	res.status(500).send(err);
	  	return console.dir(err); 
	  }

	  var collection = db.collection('messungen');
	  console.log(req.body);
	  collection.insert(req.body, function (err, result) {
	  	if (err) {
	  		res.status(500).send(err);
	  		return console.dir(err);
	  	}
	  	db.close();
	  	res.sendStatus(200);
	  });

	});
});

var server = app.listen(server_port, server_ip_address, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Started at http://%s:%s', host, port);
});
