var _ = require("underscore")
  , utils = require("gael").utils
  , Game = require("../repositories/game")
  , notifier = require('./notifier')
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

Updater.prototype.answer = function(id, questions) {
  var finder = new Finder(this.user, this.app);

  if (!_(questions).isArray()) questions = [ questions ];

  return finder.get(id).then(function(game) {
    if (game == null) return game;

    questions.forEach(function(question) {

      var q = _(game.questions).find(function(q) {
        return q.index === question.index || q.id.toString() === question.id;
      });

      if (q != null) {
        var c = _(q.choices).find(function(c) {
          return c.index === question.choice || c.id.toString() === question.choice;
        });

        if (c != null) {
          q.choices.forEach(function(choice) {
            choice.isCorrect = false;
          });

          c.isCorrect = true;
        }
      }
    });

    delete game.id;

    return this.update(id, game);

  }.bind(this));
};

module.exports = Updater;