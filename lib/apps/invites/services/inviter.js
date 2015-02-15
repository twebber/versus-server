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

var email = function(user, by, match, template) {
  return publisher.publish('email'
    , { user: user, template: template, subject: 'You\'ve been Challenged', data: { opponent: by, match: match }, force: true })

  .then(function() {
    return user;
  });
};

Inviter.prototype.invite = function(data) {
  var that = this;

  return new Finder(this.user).findByUsernameOrEmail(data.email).then(function(user) {
    if (user != null) {

      return friend.friend(that.user.id, user.id).then(function() {
        return new Matches(that.user).listByUser(that.user.id).then(function(matches) {
          var match = _(matches).find(function(m) {
            return m.opponent.id.toString() === user.id.toString();
          });

          if (match == null) return user;

          return email(user, that.user, match, 'challenged');
        });
      });
    }

    data.noEmail = true;

    return new Register(that.user).register(data).then(function(user) {

      return friend.friend(that.user.id, user.id).then(function() {
        return email(user, that.user, null, 'invited');
      });
    });
  });
};

module.exports = Inviter;

