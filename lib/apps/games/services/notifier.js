var _ = require("underscore")
  , Promise = require("bluebird")
  , broadcaster = require("gael").broadcaster
  , publisher = require("gael").publisher;

var Notifier = function() {
  if (this instanceof Notifier === false) return new Notifier;
};

var notify = function(notification, match) {
  var data = { notification: notification, user: match.opponent, data: match };
  return publisher.publish("notification", data);
};

var broadcast = function(match) {
  return broadcaster.broadcast("match", _.extend(match, { user: match.opponent.id }))

  .then(function() {
    return match;
  });
};

var determineNotification = function(match) {
  return "match/challenged";
};

Notifier.prototype.notify = function(match) {
  var notification = determineNotification(match);

  return notify(notification, match)

  .then(function() {
    return broadcast(match);
  });
};

module.exports = new Notifier;

