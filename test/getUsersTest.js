/* This file contains the /GET http://'serverhost'/directors tests */

var mocha = require('mocha');
var should = require('should');
var request = require('request');
var async = require('async');
var utils = require('./utils/utils.js');
var config = require('./utils/testConfig.js');

describe('Get users', function () {

  // Populate the database before testing
  before(function (done) {

    // Users
    var user1 = {
      id: 6488834,
      full_name: 'Steven Spielberg',
      dob: '1946-12-18T00:00:00.000Z',
      fav_cam: 'cam1'
    };

    var user2 = {
      id: 6488824,
      full_name: 'James Cameron',
      dob: '1954-08-16T00:00:00.000Z',
      fav_movies: ['movie1', 'movie2']
    };

    var user3 = {
      id: 6488818,
      full_name: 'Martin Scorsese',
      dob: '1942-11-17T00:00:00.000Z',
      fav_cam: 'cam1',
      fav_movies: ['movie1', 'movie3', 'movie4']
    };

    var user4 = {
      id: 6488888,
      full_name: 'Elba Vazquez',
      dob: '1953-05-10T00:00:00.000Z',
      fav_cam: 'cam2',
      fav_movies: 'movie1'
    };

    // Insert the users into the database
    utils.createConnection(config.redisHost.host, config.redisHost.port, function (client) {

      async.parallel([
        function (callback) {
          utils.pushToDb(user1, client, function () {
            callback();
          });
        },
        function (callback) {
          utils.pushToDb(user2, client, function () {
            callback();
          });
        },
        function (callback) {
          utils.pushToDb(user3, client, function () {
            callback();
          });
        },
        function (callback) {
          utils.pushToDb(user4, client, function () {
            callback();
          });
        }
      ], done); // continue after adding the test users
    });
  });

  // Clean the database after the tests
  after(function (done) {
    utils.createConnection(config.redisHost.host, config.redisHost.port, function (client) {
      utils.cleanDB(client, function () {
        done();
      });
    });
  });

  // Get users tests
  it('Should sent a 200 status code and the users array', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';
    request(targetUri, function (err, response, body) {
      var resBody = JSON.parse(body);
      resBody.ok.should.be.equal(true);
      resBody.users.length.should.be.equal(4);
      done();
    });
  });
});
