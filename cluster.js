var cluster = require("cluster")
  , os = require("os")
  , domain = require("domain")
  , gael = require("gael")
  , utils = gael.utils
  , log = gael.log;

var numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", function(worker, code, signal) {
    log.error("Worker " + worker.process.pid + " died.");

    prcoess.exit(1);
  });

  cluster.on("disconnect", function(worker) {
    cluster.fork();
  });

} else {
  var global = domain.create();

  global.on("error", function(err) {
    log.error("Unhandled web exception %s/n%s", err.message, JSON.stringify(err.stack));

    cluster.worker.disconnect();
  });

  global.run(function() {
    var App = require("./lib/" + utils.getApp(process.argv))
      , app = new App();
    
    app.start();
  });
}