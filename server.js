var express = require('express');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/', function (req, res) {
  res.send('demo');
});

var server = app.listen(server_port,  server_ip_address, function () {

  console.log('Example app listening at http://%s:%s', server_ip_address, server_port);
});