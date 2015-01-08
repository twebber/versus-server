var Promise = require('bluebird')
  , gael = require('gael')
  , Server = gael.server
  , store = gael.store
  , log = gael.log
  , utils = gael.utils
  , configuration = gael.configuration
  , initialize = require('./initializers');

var App = function() {
  if (this instanceof App === false) return new App;

  this.server = new Server();
  this.store = store;
};

var logError = function(err) {
  log.error(err, err.stack);
};

App.prototype.init = function() {
  var server = this.server
    , apps = utils.folders(__dirname + '/apps');

  server.configure();

  initialize('components', server, 'garda'); //, 'plora');

  return new Promise(function(resolve, reject) {   

    server.route(function(app) {
      initialize('routes', app, apps);
    });

    initialize('consumers', apps);
    initialize('listeners', apps, server.server);

    return initialize('indexes', apps).then(resolve);
  });
};

App.prototype.start = function(done) {
  return this.init()
  
  .then(function() {
    this.server.start(done);
  }.bind(this))
  
  .catch(logError);
};

App.prototype.stop = function(done) {
  this.server.stop(done);
};

module.exports = App;
