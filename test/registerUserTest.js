/* This file contains the /POST http://'serverhost'/directors tests */

var mocha = require('mocha');
var should = require('should');
var request = require('request');
var utils = require('./utils/utils.js');
var config = require('./utils/testConfig.js');

describe('Register users', function () {

  // Clean the database after the tests
  after(function (done) {
    utils.createConnection(config.redisHost.host, config.redisHost.port, function (client) {
      utils.cleanDB(client, function () {
        done();
      });
    });
  });

  /* Regular test */
  it('Should register the user', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';

    var postData = {
      livestream_id: 6488818,
      fav_cam: 'cam1'
    };

    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: targetUri
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(201);
      done();
    });
  });

  /* No livestream id provided */
  it('Should not register the user (no livestream id)', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';

    var postData = {
      fav_cam: 'cam1'
    };

    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: targetUri
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(401);
      done();
    });
  });

  /* User already registered */
  it('Should not register the user (user already registered)', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';

    var postData = {
      livestream_id: 6488818
    };

    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: targetUri
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(500);
      done();
    });
  });

  /* Bad livestream id provided */
  it('Should not register the user (bad livestream_id)', function (done) {
    var targetUri = 'http://' + config.serverHost.host + ':' + config.serverHost.port + '/directors';

    var postData = {
      livestream_id: 'avf1234'
    };

    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: targetUri
    }

    request(options, function (err, res, body) {
      res.statusCode.should.be.equal(400);
      done();
    });
  });
});
