/* This file contains the /PUT http://'serverhost'/directors tests */

var mocha = require('mocha');
var should = require('should');
var request = require('request');
var utils = require('./utils/utils.js');
var config = require('./utils/testConfig.js');

describe('Modify user', function () {

  // Add test user to the database before performing the tests
  before(function (done) {

    var user = {
      id: 6488834,
      full_name: 'Steven Spielberg',
      dob: '1946-12-18T00:00:00.000Z',
      fav_cam: 'cam1'
    };

    utils.createConnection(config.redisHost.host, config.redisHost.port, function (client) {
      utils.pushToDb(user, client, function () {
        done();
      });
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

  /* Regular test */
  it('Should modify the user', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';
    var idMd5 ='ea29be645009c8ac6539342cf81d0a95';

    var postData = {
      fav_cam: 'cam2',
      fav_movies: ['movie1', 'movie2']
    };

    var headers = {
      Authorization: 'Bearer ' + idMd5,
      "Content-type": 'Application/json'
    }

    var options = {
      method: 'put',
      body: postData,
      json: true,
      url: targetUri,
      headers: headers
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(200);
      done();
    });
  });

  /* No authentication header provided */
  it('Should not modify the user (no authentication header)', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';

    var options = {
      method: 'put',
      json: true,
      url: targetUri
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(401);
      done();
    });
  });

  /* User not found */
  it('Should not find the user (bad id)', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';
    var idMd5 ='abcdefgh';

    var postData = {
      fav_cam: 'cam2',
      fav_movies: ['movie1', 'movie2']
    };

    var headers = {
      Authorization: 'Bearer ' + idMd5,
      "Content-type": 'Application/json'
    }

    var options = {
      method: 'put',
      body: postData,
      json: true,
      url: targetUri,
      headers: headers
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(404);
      done();
    });
  });
});
