var _ = require("underscore")
  , Promise = require("bluebird")
  , User = require("garda").user.Finder
  , Match = require("../repositories/match")
  , Game = require("../../games/repositories/game");

var Finder = function(user, app) {
  if (this instanceof Finder === false) return new Finder(user, app);

  this.user = user;
  this.app = app;
};

var align = function(user, opponent, match, game) {
  match.game = game;

  match.player = user;
  match.opponent = opponent;

  return match;
};

var construct = Promise.method(function(user, opponent, match, game) {
  if (match) return align(user, opponent, match, game);

  if (game == null) {
    return { id: Match.id()
           , player: user
           , opponent: opponent
           };
  }
console.log(game.id, game._id);
  return Match.create({ 
    player: user.id.toString()
  , opponent: opponent.id.toString()
  , game: game.id.toString() 
  })

  .then(function(match) {
    return { id: match.id
           , player: user
           , opponent: opponent
           , game: game
           };
  });
});

Finder.prototype.get = function(id) {
  var user = this.user
    , finder = new User(user);

  return Match.get(id).then(function(match) {
    if (user.id.toString() !== match.player) {
      match.player = match.opponent;
      match.opponent = user.id.toString();
    }

    return Game.get(match.game).then(function(game) {
      return finder.get(match.player).then(function(player) {
        return finder.get(match.opponent).then(function(opponent) {

          match.player = player;
          match.opponent = opponent;
          match.game = game;

          return match;
        });
      });
    });
  });
};

var listGames = function(ids, app) {
  return Game.getActive(app).then(function(game) {
    return Game.listByIds(ids).then(function(games) {
      if (game != null) games.push(game);
      return { games: games, active: game };
    });
  });
};

Finder.prototype.listByUser = function(id) {
  var app = this.app
    , finder = new User(this.user);

  return finder.get(id).then(function(user) {
    if (user == null) return;

    var userId = user.id.toString();

    return finder.listFriends(user).then(function(opponents) {
      
      return Match.listByUser(user).then(function(matches) {

        return listGames(_(matches).pluck("game"), app).then(function(games) {

          var build = function(opponent) {
            var match = _(matches).find(function(m) {
              return m.opponent.toString() === opponent.id.toString() || m.player.toString() === opponent.id.toString();
            });

            return construct(user, opponent, match, games.active);
          };

          return Promise.all(opponents.map(build));
        });
      });
    });
  });
};

module.exports = Finder;