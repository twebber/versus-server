var Promise = require('bluebird')
  , publisher = require('gael').publisher
  , Register = require('garda').user.Register
  , Finder = require('garda').user.Finder;

var Inviter = function(user, app) {
  if (this instanceof Inviter === false) return new Inviter(user, app);

  this.user = user;
  this.app = app;
};

var invite = Promise.method(function(user, by) {
  return publisher.publish('email'
    , { user: user, template: 'invited', subject: 'Invite', data: { user: user, invitedBy: by }, force: true });
});

Inviter.prototype.invite = function(data) {
  var that = this;

  return new Finder(this.user).findByUsernameOrEmail(data.email).then(function(user) {
    if (user != null) return user;

    data.noEmail = true;

    return new Register(that.user).register(data).then(function(user) {
      return invite(user, that.user).then(function() {
        return user;
      });
    });
  });
};

module.exports = Inviter;

