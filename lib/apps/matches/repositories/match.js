var _ = require("underscore")
  , inherits = require("util").inherits
  , Promise = require("bluebird")
  , Base = require("gael").Repository;

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, "matches");
};

inherits(Repository, Base);

Repository.prototype.clean = function(match) {
  if (match.startedAt) match.startedAt = new Date(match.startedAt);
  if (match.endedAt) match.endedAt = new Date(match.endedAt);

  return match;
};

Repository.prototype.listActiveByUser = function(user, game) {
  var userId = user.id.toString()
    , gameId = game == null ? null : game.id.toString();

  return this.list({ $or: [ { player: userId }, { opponent: userId } ], game: gameId });
};

Repository.prototype.listByUser = function(user, game) {
  var userId = user.id.toString();

  return this.list({ $or: [ { player: userId }, { opponent: userId } ] });
};

Repository.prototype.listByIds = function(ids) {
  return this.ids(ids, { sort: { name: 1 }});
};

module.exports = new Repository;