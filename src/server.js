/* Server file */
var express = require('express');
var config = require('./config.js');

var app = express();
app.listen(config.serverPort)

/* Route to list all the directors in the database */
app.get('/directors', function (req, res) {
  // directors GET request route handler
});

/* Route to register a director into the database */
app.post('/directors', function (req, res) {
  // directors POST request route handler
});

/* Route to modify ingormation about a certain director */
app.put('/directors/:id', function (req, res) {
  // directors PUT request route handler
});
