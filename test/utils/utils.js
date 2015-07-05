/* File that contains aux functions needed by the tests */

var redis = require('redis');

/* Create connection to the Redis server */
var createConnection = function (host, port, cb) {
  var client = redis.createClient(port, host);

  client.on('connect', function() {
    console.log('connected to Redis database');
  });

  cb(client);
}

/* Function to clean the database */
var cleanDB = function (client, cb) {

 client.flushall(function () {
  client.end();
  cb();
 })
}

/* Function to populate the data base */
var pushToDb = function (user, client, cb) {
  var key = 'user:' + user.id;

  client.hmset(key, {
        'accountid': user.id,
        'full_name': user.name,
        'dob': user.dob,
        'fav_cam': user.fav_cam,
        'fav_movies': user.fav_movies
      }, function (err) {
        cb();
  });
}

exports.createConnection = createConnection;
exports.cleanDB = cleanDB;
exports.pushToDb = pushToDb;
