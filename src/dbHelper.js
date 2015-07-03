/* File that contains all the database operations needed */

var redis = require('redis');

/* Function to open a connection to the Redis server */
var createConnection = function (host, port) {
  var client = redis.createClient(port, host);

  client.on('connect', function() {
    console.log('connected');
  });

  return client;
}

/* Function to add a user to the mysql database */
var addUser = function (user, client, cb) {
  var key = 'user:' + user.id;
  var err;

  client.exists(key, function (err, res) {
    if (res === 1) {
      err = 'ERROR: User already exists';
      cb(err);
    } else {
      client.hmset(key, {
        'accountid': user.id,
        'full_name': user.name,
        'dob': user.dob,
        'fav_cam': user.fav_cam,
        'fav_movies': user.fav_movies
      }, function (err) {
        if (err) {
          console.log('Database insertion error: ' + err);
          cb(err);
        } else{
          cb();
        }
      });
    }
  });
}

/* Function to update the favorite cam and movies fields */
var modifyUser = function (id, updateFields, client, cb) {
 var key = 'user:' + user.id;

  // Update the fav_cam field
  if (updateFields.hasOwnProperty(fav_cam)) {
    client.hmset(key, {'fav_cam': updateFields.fav_cam});
  }

  // Update the fav_movies field
  if (updateFields.hasOwnProperty(fav_movies)) {
    client.hmset(key, {'fav_movies': updateFields.fav_movies});
  }

  cb(err, res);
}

/* Function to return all the users in the database */
var getUsers = function (client, cb) {
  var users = [];
  var multiQueue = client.multi(); // handle async call to the database

  client.keys('user:*', function (err, keys) {
    for (var i = 0; i < keys.length; i++) {
      multiQueue = multiQueue.hgetall(keys[i]);
    }

    multiQueue.exec(function (err, replies) {
      users = replies;
      cb(err, users);
    });
  });
}

exports.createConnection = createConnection;
exports.addUser = addUser;
exports.modifyUser = modifyUser;
exports.getUsers = getUsers;
