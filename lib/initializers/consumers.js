var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , Queue = require('gael').Consumer;

module.exports.init = function(apps, options) {  
  _(apps).forEach(function(name) {

    var directory = path.join(__dirname, '/../apps', name, 'consumers');

    if (fs.existsSync(directory) === false) return;

    var files = fs.readdirSync(directory);

    _(files).each(function(file) {
      var Consumer = require(path.join(directory, file));
      new Consumer(new Queue).listen();
    });
  });
};