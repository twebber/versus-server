var domain = require("domain")
  , gael = require("gael")
  , utils = gael.utils
  , log = gael.log;

var global = domain.create();

global.on("error", function(err) {
  log.error("Unhandled web exception %s/n%s", err.message, JSON.stringify(err.stack));
});

global.run(function() {
  var App = require("./lib/" + utils.getApp(process.argv))
    , app = new App();
  
  app.start();
});
