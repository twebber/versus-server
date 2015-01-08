var _ = require('underscore')
  , Promise = require('bluebird')
  , fs = require('fs')
  , path = require('path');

module.exports.init = function(apps, options) {  
  var promises = _(apps).map(function(name) {

    var directory = path.join(__dirname, '/../apps', name, 'repositories');

    if (fs.existsSync(directory) === false) return;

    var files = fs.readdirSync(directory);

    return _(files).map(function(file) {
      var Repository = require(path.join(directory, file));
      if (!Repository.index) return;
      return Repository.index();
    });
  });

  return Promise.all(promises);
};