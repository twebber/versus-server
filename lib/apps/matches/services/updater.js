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

var setId = function(item) {
  if (item.id == null) item.id = Match.id();
};

var setIds = function(data) {
  if (data == null) return;
  data.forEach(setId);
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

  setIds(match.answers);
  setIds(match.alternates);
  setIds(match.rewards);
  setIds(match.forfeits);
  setIds(match.tiebreaks);

  if (filterAnswers(match.answers, 'player').length > 0 && filterAnswers(match.answers, 'opponent').length > 0) {
    var finder = new Game();

    return finder.get(match.game).then(function(game) {

      _.chain(game.questions).sortBy('index').forEach(function(question) {

        var playerAnswer = findAnswer(match.answers, question, 'player')
          , playerAlternate = findAnswer(match.alternates, question, 'player')
          , opponentAnswer = findAnswer(match.answers, question, 'opponent')
          , opponentAlternate = findAnswer(match.alternates, question, 'opponent');

        if (match.data == null || match.data.hasFirstPick == null) {
          var hasFirstPick = utils.random(100) > 49 ? match.player : match.opponent;
          match.data = { hasFirstPick: hasFirstPick };
        }

        if (question.index % 2 === ((match.data.hasFirstPick === match.player) ? 1 : 0)) {
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