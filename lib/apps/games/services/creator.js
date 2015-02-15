var _ = require("underscore")
  , Game = require("../repositories/game");

var Creator = function(user, app) {
  if (this instanceof Creator === false) return new Creator(user);

  this.user = user;
  this.app = app;
};

var identify = function(thing) {
  thing.id = Game.id();
  return thing;
};

Creator.prototype.create = function(game) {
  game.questions.forEach(function(question) {
    question = identify(question);

    question.choices.forEach(function(choice) {
      choice = identify(choice);
    });
  });

  if (game.rewards) {
    game.rewards.forEach(function(reward) {
      reward = identify(reward);
    });
  }

  // TODO Validate game

  game.startedAt = new Date; // TODO Schedule the game

  return Game.create(game);
};

module.exports = Creator;