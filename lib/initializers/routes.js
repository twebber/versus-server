var _ = require('underscore')
  , express = require('express')
  , gael = require('gael')
  , garda = require('garda')
  , cache = gael.cache
  , errors = gael.errors
  , authorize = gael.middleware.authorize
  , auth = gael.middleware.authenticate
  , session = garda.user.session;

module.exports.init = function(app, apps, options) {  

  _(apps).each(function(name) {

    var router = express.Router()
      , route = require(__dirname + '/../apps/' + name + '/resources/routes')
      , resource = require(__dirname + '/../apps/' + name + '/resources');

    var restrict = auth(session, { restrict: true })
      , authenticate = auth(session, { restrict: false });

    route(router, resource, authenticate, restrict, authorize, errors, cache);

    app.use('/' + name, router);
  });

  app.get('/', function(req, res, next) {
    res.render('index');
  });
};