var _ = require('underscore')
  , initialize = require('./initializers')
  , gael = require('gael')
  , configuration = gael.configuration;
  , marker = gael.marker
  , utils = gael.utils;

var App = function() {
  if (this instanceof App === false) return new App;
};

var getJob = function(argv) {
  var job = _(process.argv).find(function(arg) {
    return arg.indexOf('--job:') === 0;
  });

  job = job.split(':')[1];
  job = job.split('/');

  return { app: job[0], name: job[1] };
}

App.prototype.start = function(done) {

  var job = getJob(process.argv)
    , Runner = require('./apps/' + job.app + '/jobs/' + job.name);

  var config = configuration([ 'schedules', job.app, job.name ].join(':'));

  var runner = new Runner(null, marker);
  return runner.run(config.OPTIONS);
};

App.prototype.stop = function(done) {
  // TODO stop scheduler
};

module.exports = App;
