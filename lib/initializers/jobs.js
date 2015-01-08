var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , gael = require('gael')
  , scheduler = gael.scheduler
  , marker = gael.marker;

module.exports.init = function(apps, options) {
  _(apps).forEach(function(name) {

    var directory = path.join(__dirname, '/../apps', name, 'jobs');

    if (fs.existsSync(directory) === false) return;

    var files = fs.readdirSync(directory);

    _(files).each(function(file) {
      var Job = require(path.join(directory, file))
        , job = new Job(scheduler, marker);
      job.schedule();
    });
  });
};