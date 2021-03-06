var _ = require("underscore")
  , utils = require("gael").utils
  , Game = require("../repositories/game")
  , Finder = require("./finder");

var Updater = function(user, app) {
  if (this instanceof Updater === false) return new Updater(user, app);

  this.user = user;
  this.app = app;
};

Updater.prototype.update = function(id, game) {
  var finder = new Finder(this.user, this.app);

  return Game.update(id, Game.clean(game)).then(function() {
    return finder.get(id).then(function(game) {
      // return notifier.notify(game).then(function() {
        return game;
      // });
    })
  });
};

module.exports = Updater;