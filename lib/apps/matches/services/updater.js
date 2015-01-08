var _ = require("underscore")
  , Promise = require("bluebird")
  , Match = require("../repositories/match")
  , Finder = require("./finder")
  , notifier = require("./notifier");

var Updater = function(user, app) {
  if (this instanceof Updater === false) return new Updater(user, app);

  this.user = user;
  this.app = app;
};

Updater.prototype.update = Promise.method(function(id, match) {
  var finder = new Finder(this.user, this.app);

  match.answers.forEach(function(answer) {
    answer.id = Match.id();
  });

  return Match.update(id, Match.clean(match)).then(function() {
    return finder.get(id).then(function(match) {
      // return notifier.notify(match).then(function() {
        return match;
      // });
    })
  });
});

module.exports = Updater;