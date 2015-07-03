/* File that contains all the database operations needed */

var redis = require('redis');

/* Function to open a connection to the Redis server */
var createConnection = function (host, port, cb) {
  var client = redis.createClient(port, host);

  client.on('connect', function() {
    console.log('connected');
    cb(client);
  });
}

/* Function to add a user to the mysql database */
var addUser = function (user, client, cb) {
  var key = 'user:' + user.id;
  var res;

  if(client.exists(key)) {
    console.log('Already registered user')
  } else {
    client.hmset(key, {
      'accountid': user.id,
      'full_name': user.name,
      'fav_cam': user.fav_cam,
      'fav_movies': user.fav_movies
    }, function (err) {
      if (err) {
        console.log('Database insertion error: ' + err);
        res = err;
      }
      cb(res);
    });
  }

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
}

/* Function to return all the users in the database */
var getUsers = function (client, cb) {
  var users = [];
  var multiQueue = client.multi();

  client.keys('user:*', function (err, keys) {
    for (var i = 0; i < keys.length; i++) {
      multiQueue = multiQueue.hgetall(keys[i]);
    }

    multiQueue.exec(function (err, replies) {
      console.log(JSON.stringify(replies));
    });
  });
}
