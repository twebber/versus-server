var Promise = require('bluebird')
  , garda = require('garda')
  , Group = garda.group.Register
  , User = garda.user.Register
  , Role = garda.role.Creator
  , p = require('gael').Authorizer.permissions;

var Seed = function() {
  if (this instanceof Seed === false) return new Seed;
};

var seed = function(group) {
  return group.system()

  .then(function(system) {
    return group.register({ name: 'Secured', parent: system.id }
      , { username: 'administrator', password: 'secret', role: 'administrator' })

    .then(function() {
      return group.register({ name: 'Unsecured', parent: system.id }
        , { username: 'user', password: 'secret', role: 'user', permissions: p.ReadOnly });
    });
  });
};

Seed.prototype.run = function(done) {
  seed(new Group).then(function() {
    done();
  });
};

module.exports = new Seed;