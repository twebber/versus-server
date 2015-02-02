var _ = require("underscore")
  , Promise = require("bluebird")
  , Match = require("../repositories/match")
  , Game = require("../../games/services/finder")
  , Finder = require("./finder")
  , notifier = require("./notifier");

var Updater = function(user, app) {
  if (this instanceof Updater === false) return new Updater(user, app);

  this.user = user;
  this.app = app;
};

var process = Promise.method(function(match) {

  var filterAnswers = function(answers, key) {
    return _(answers).filter(function(answer) {
      return answer.user === match[key];
    });
  };

  var findAnswer = function(answers, question, key) {
    return _(answers).find(function(answer) {
      return answer.question === question.id.toString() && answer.user === match[key];
    });
  };

  match.answers.forEach(function(answer) {
    answer.id = Match.id();
  });

  match.alternates.forEach(function(alternate) {
    alternate.id = Match.id();
  });

  if (filterAnswers(match.answers, 'player').length > 0 && filterAnswers(match.answers, 'opponent').length > 0) {
    var finder = new Game();

    return finder.get(match.game).then(function(game) {

      _.chain(game.questions).sortBy('index').forEach(function(question) {

        var playerAnswer = findAnswer(match.answers, question, 'player')
          , playerAlternate = findAnswer(match.alternates, question, 'player')
          , opponentAnswer = findAnswer(match.answers, question, 'opponent')
          , opponentAlternate = findAnswer(match.alternates, question, 'opponent');

        if (question.index % 2 === 1) {
          if (opponentAnswer.choice === playerAnswer.choice) opponentAnswer.choice = opponentAlternate.choice;
        } else {
          if (opponentAnswer.choice === playerAnswer.choice) playerAnswer.choice = playerAlternate.choice;          
        }
      });

      match.alternates = [];

      return match;
    });
  }

  return match;
});

Updater.prototype.update = Promise.method(function(id, match) {
  var finder = new Finder(this.user, this.app);

  return process(match).then(function(match) {
    return Match.update(id, Match.clean(match)).then(function() {
      return finder.get(id).then(function(match) {
        // return notifier.notify(match).then(function() {
          return match;
        // });
      })
    });
  });

});

module.exports = Updater;