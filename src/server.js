/* Server file */

var express = require('express');
var config = require('./config.js');
var dbHelper = require('./dbHelper.js');
var bodyParser = require('body-parser');
var request = require('request');

var jsonParser = bodyParser.json();

var dbServer = {
  host: config.redisHost.host,
  port: config.redisHost.port
}

var app = express();
app.listen(config.serverPort);

var client = dbHelper.createConnection(dbServer.host, dbServer.port);

/* Route to list all the directors in the database */
app.get('/directors', function (req, res) {
  dbHelper.getUsers(client, function (err, users) {
    res.status(200).send({ok: true, users: users});
  });
});

/* Route to register a director into the database */
app.post('/directors', jsonParser, function (req, res) {
  var reqBody = req.body;
  var user;// object to save in the redis database
  if (reqBody.livestream_id === undefined) {
    res.status(401).send({Error: 'Must provide valid livestream_id'});
  } else {
    var targetUri = 'https://api.new.livestream.com/accounts/' + reqBody.livestream_id;

    // Request to the livestream api
    request(targetUri, function (err, response, body) {
      if (err) {
        res.status(400).send({Error: err});
      } else {
        var resBody = JSON.parse(body);
        user = {
          id: resBody.id,
          name: resBody.full_name,
          dob: resBody.dob,
          fav_cam: reqBody.fav_cam,
          fav_movies: reqBody.fav_movies
        }

        // Add new user to the database
        dbHelper.addUser(user, client, function (err) {
          if (err) {
            res.status(500).send({Error: err});
          } else {
            res.status(201).send({ok: true, user: user})
          }
        });
      }
    });
  }
});

/* Route to modify information about a certain director */
app.put('/directors', jsonParser, function (req, res) {
  var authHeader = req.get('Authorization');

  if (authHeader == undefined) {
    res.status(401).send({Error: 'Unauthorized'});
  } else {
    // Code to get the hash part of the header
    var splitted = authHeader.split(' ');
    var hash = splitted[1]; // this is the hash

    dbHelper.authenticate(hash, client, function (err, id) {
      if (err) {
        res.status(404).send({Error: 'User not found'});
      } else {
        dbHelper.modifyUser(id, req.body, client, function (err) {
          if (err) {
            res.status(500).send({Error: err});
          } else {
            res.status(200).send({ok:true});
          }
        });
      }
    });
  }
});
