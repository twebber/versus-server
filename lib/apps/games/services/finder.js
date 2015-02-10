var _ = require("underscore")
  , utils = require("gael").utils
  , Game = require("../repositories/game");

var Finder = function(user, app) {
  if (this instanceof Finder === false) return new Finder(user, app);

  this.user = user;
  this.app = app;
};

var determineQuery = function(query) {
  if (query.ids) return this.listByIds.bind(this);
  if (query.active) return this.active.bind(this);
  return this.all.bind(this);
};

var reformat = function(game) {
  if (game == null) return game;

  game.questions.forEach(function(question) {
    question.game = game.id;

    question.choices.forEach(function(choice) {
      choice.question = question.id;
    });
  });

  return game;
};

Finder.prototype.list = function(query) {
  var list = determineQuery.call(this, query);

  return list(query).then(function(games) {
    return games.map(reformat);
  });
};

Finder.prototype.get = function(id) {
  return Game.get(Game.id(id)).then(function(game) {
    return reformat(game);
  });
};

Finder.prototype.all = function(query) {
  return Game.list(this.app);
};

Finder.prototype.active = function(query) {
  return Game.listActive(this.app);
};

Finder.prototype.listByIds = function(query) {
  return Game.listByIds(query.ids || query);
};

module.exports = Finder;