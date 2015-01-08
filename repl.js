var repl = require('repl')
  , utils = require('gael').utils;

var environment = process.env.NODE_ENV || 'development';

var App = require('./lib/' + utils.getApp(process.argv))
  , app = new App();

app.start().then(function() {
  var replServer = repl.start({
    prompt: '$ Versus (' + environment + ') > '
  });

  replServer.context.app = app;
});