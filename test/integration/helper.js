var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , btoa = require('btoa')
  , request = require('supertest')
  , Promise = require('bluebird')
  , seed = require('./seed')
  , fixture = require('../fixture')
  , factory = require('autofixture')
  , garda = require('garda')
  , Application = require('../../lib/app')
  , utils = require('gael').utils;

var Helper = function() {
  if (this instanceof Helper === false) return new Helper;

  this.application = new Application()

  this.server = this.application.server;
  this.store = this.application.store;
  this.app = this.server.app;

  this.apps = utils.folders(__dirname + '/../../lib/apps');
};

var clean = function(name) {
  var directory = path.join(__dirname + '/../../lib/apps', name, 'repositories');

  if (fs.existsSync(directory) === false) return Promise.cast();

  var files = fs.readdirSync(directory);

  return files.map(function(file) {
    var Repository = require(path.join(directory, file));
    return Repository.truncate();
  });
};

Helper.prototype.start = function(done) {
  this.application.start(done);
};

Helper.prototype.stop = function(done) {
  this.application.stop(done);
};

Helper.prototype.seed = function(done) {
  this.clean(function() {
    seed.run(done);
  });
};

Helper.prototype.agent = function() {
  return request.agent(this.app);
};

Helper.prototype.signOn = function(authentication, done) {
  if (done == null) {
    done = authentication;
    authentication = { username: 'root', password: 'secret' };
  }

  return this.agent()
  .post('/sessions/')
  .set('Accept', 'application/json')
  .send({ session: authentication })
  .end(function(err, res) {
    return done(res.body.session);
  });
};

Helper.prototype.authentication = function(session) {
  var authorization = btoa([ session.id, session.token ].join(':'));
  return 'Basic ' + authorization;
};

Helper.prototype.fixture = function(entity, number, data) {
  fixture(factory);

  if (_(number).isNumber()) {
    return factory.createListOf(entity, number, data);
  } else {
    data = number;
    return factory.create(entity, data);
  }
};

Helper.prototype.clean = function(done) {
  Promise.all(this.apps.map(clean)).then(function() {

    garda.helper.clean(function() {      
      return done();
    });
  });
};

module.exports = new Helper;