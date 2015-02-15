var _ = require("underscore")
  , Promise = require("bluebird")
  , broadcaster = require("gael").broadcaster
  , publisher = require("gael").publisher;

var Notifier = function() {
  if (this instanceof Notifier === false) return new Notifier;
};

var notify = Promise.method(function(notification, match) {
  if (notification == null) return;

  var data = { notification: notification, user: match.opponent, data: { match: match, opponent: match.player }};
  return publisher.publish('notification', data);
});

var broadcast = function(match) {
  return broadcaster.broadcast('match', match, match.opponent.id)
};

var determineNotification = function(match) {
  var filter = function(answers, key) {
    return _(answers).filter(function(answer) {
      return answer.user === match[key];
    });
  };

  if (filter(match.answers, 'opponent').length === 0) return 'challenged';
};

Notifier.prototype.notify = function(match) {
  var notification = determineNotification(match);

  return notify(notification, match)

  .then(function() {
    return broadcast(match);
  });
};

module.exports = new Notifier;

