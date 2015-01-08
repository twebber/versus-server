var path = require('path')
  , fs = require('fs')
  , Promise = require('bluebird')
  , gael = require('gael')
  , redis = gael.redis
  , utils = gael.utils;

var apps = utils.folders(__dirname + '/../lib/apps')
  , promises = apps.map(function(name) {

  var directory = path.join(__dirname + '/../lib/apps', name, 'repositories');

  if (fs.existsSync(directory) === false) return Promise.cast();

  var files = fs.readdirSync(directory);

  return files.map(function(file) {
    var Repository = require(path.join(directory, file));
    return Repository.truncate();
  });
});

// Flush redis
var flush = Promise.promisify(redis.connection.flushdb.bind(redis.connection));

promises.push(flush);

Promise.all(promises).then(function() {
  setTimeout(process.exit, 1000);
}, console.log);
