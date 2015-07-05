/* File that contains all the database operations needed */

var redis = require('redis');
var async = require('async');
var crypto = require('crypto');

/* Function to open a connection to the Redis server */
var createConnection = function (host, port) {
  var client = redis.createClient(port, host);

  client.on('connect', function() {
    console.log('connected to Redis database');
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
          // Create md5 to authenticate
          var hash = crypto.createHash('md5').update(String(user.id)).digest('hex');
          var keyHash = 'hash:' + hash;
          client.hmset(keyHash, {
            'accountid': user.id
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
  });
}

/* Function to update the favorite cam and movies fields */
var modifyUser = function (id, updateFields, client, cb) {
  var key = 'user:' + id;

  async.parallel([
    function (callback) {
      // Update the fav_cam field
      if (updateFields.fav_cam != undefined) {
        client.hmset(key, {'fav_cam': updateFields.fav_cam}, function (err) {
          callback();
        });
      } else {
        callback()
      }
    },
    function (callback) {
      // Update the fav_movies field
      if (updateFields.fav_movies != undefined) {
        client.hmset(key, {'fav_movies': updateFields.fav_movies}, function (err) {
          callback();
        });
      } else {
        callback();
      }
    }
  ], function (err) {
    cb(err);
  });
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

/* Aux function needed to check if a user can modify an account */
var authenticate = function (hash, client, cb) {
  var key = 'hash:' + hash;

  client.hgetall(key, function (err, obj) {
    if (obj == undefined) {
      err = 'ERROR: User does not exists';
      cb(err);
    } else {
      cb(err, obj.accountid);
    }
  });
}

exports.createConnection = createConnection;
exports.addUser = addUser;
exports.modifyUser = modifyUser;
exports.getUsers = getUsers;
exports.authenticate = authenticate;
