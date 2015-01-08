var _ = require("underscore")
  , inherits = require("util").inherits
  , Promise = require("bluebird")
  , Base = require("gael").Repository;

var Repository = function() {
  if (this instanceof Repository === false) return new Repository;

  Base.call(this, "games");
};

inherits(Repository, Base);

Repository.prototype.clean = function(game) {
  if (game.startedAt) game.startedAt = new Date(game.startedAt);
  if (game.endedAt) game.endedAt = new Date(game.endedAt);

  return game;
};

Repository.prototype.listActive = function() {
  var now = new Date;

  return this.list({ 
    startedAt: { $lte: now } 
  , $or: [ { endedAt: { $gte: now }}, { endedAt: null } ]
  });
};

Repository.prototype.getActive = function() {
  var now = new Date;

  return this.find({ 
    startedAt: { $lte: now } 
  , $or: [ { endedAt: { $gte: now }}, { endedAt: null } ]
  });
};

Repository.prototype.listByIds = function(ids) {
  return this.ids(ids, { sort: { name: 1 }});
};

module.exports = new Repository;