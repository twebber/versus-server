var log = require('gael').log;

module.exports = function() {
  var app = require('../../package').name
    , name = arguments[0]
    , args = Array.prototype.slice.call(arguments, 1);

  log.info('Versus: initialising ' + name);

  return require('./' + name).init.apply(null, args);
};