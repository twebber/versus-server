var Finder = require("../services/finder")
  , Creator = require("../services/creator");

module.exports = function(errors, cache) {
  
  return {
    get: function(req, res, next) {
      new Finder(req.user)

      .list(req.query)

      .then(function(games) {
        return res.json({ games: games });
      })

      .catch(next);
    }

  , post: function(req, res, next) {
      new Creator(req.user)

      .create(req.body.game)

      .then(function(game) {
        return res.json({ game: game });
      })

      .catch(next);
    }
  
  };
};
