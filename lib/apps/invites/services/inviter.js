var _ = require('underscore')
  , Promise = require('bluebird')
  , publisher = require('gael').publisher
  , Matches = require('../../matches/services/finder')
  , Register = require('garda').user.Register
  , Finder = require('garda').user.Finder
  , friend = require('garda').user.friend;

var Inviter = function(user, app) {
  if (this instanceof Inviter === false) return new Inviter(user, app);

  this.user = user;
  this.app = app;
};

var email = function(user, by, template) {
  return publisher.publish('email'
    , { user: user, template: template, subject: 'You\'ve been challenged', data: { opponent: by }, force: true })

  .then(function() {
    return user;
  });
};

Inviter.prototype.invite = function(data) {
  var that = this;

  return new Finder(this.user).findByUsernameOrEmail(data.email).then(function(user) {
    if (user != null) {

      return friend.friend(that.user.id, user.id).then(function() {
        return email(user, that.user, 'friended');
      });
    }

    data.noEmail = true;
    data.shouldChangePassword = true;

    return new Register(that.user).register(data).then(function(user) {

      return friend.friend(that.user.id, user.id).then(function() {
        return email(user, that.user, 'invited');
      });
    });
  });
};

module.exports = Inviter;

