var Promise = require("bluebird")
  , initialize = require("./initializers")
  , gael = require('gael')
  , utils = gael.utils;

var App = function() {
  if (this instanceof App === false) return new App;
};

App.prototype.start = function(done) {
  var apps = utils.folders(process.cwd() + "/server/lib/apps");
  
  initialize("jobs", apps);

  return Promise.cast();
};

App.prototype.stop = function(done) {
  // TODO stop scheduler
};

module.exports = App;
