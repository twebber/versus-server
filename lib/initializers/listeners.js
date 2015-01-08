var Listener = require('gael').Listener;

module.exports.init = function(apps, options) {
  var listener = new Listener(options.server);

  listener.listen();
};