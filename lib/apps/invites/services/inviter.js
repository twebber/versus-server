var Promise = require('bluebird')
  , publisher = require('gael').publisher
  , Register = require('garda').user.Register
  , Finder = require('garda').user.Finder;

var Inviter = function(user, app) {
  if (this instanceof Inviter === false) return new Inviter(user, app);

  this.user = user;
  this.app = app;
};

var email = function(user, by, template) {
  return publisher.publish('email'
    , { user: user, template: template, subject: 'You\'ve been Challenged', data: { opponent: by }, force: true })

  .then(function() {
    return user;
  });
};

Inviter.prototype.invite = function(data) {
  var that = this;

  return new Finder(this.user).findByUsernameOrEmail(data.email).then(function(user) {
    if (user != null) return email(user, that.user, 'challenged');

    data.noEmail = true;

    return new Register(that.user).register(data).then(function(user) {
      return email(user, that.user, 'invited');
    });
  });
};

module.exports = Inviter;

