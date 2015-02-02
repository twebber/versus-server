var Finder = require("../services/finder")
  , Updater = require("../services/updater");

module.exports = function(errors, cache) {
  
  return {
    
    get: function(req, res, next) {
      new Finder(req.user)

      .get(req.params.id)

      .then(function(game) {
        if (game == null) return next(new errors.NotFoundError());

        return res.json({ game: game });
      })

      .catch(next);
    }
    
  , put: function(req, res, next) {
      new Updater(req.user)

      .update(req.params.id, req.body.game)

      .then(function(game) {
        res.json({ game: game });
      })

      .catch(next);
    }

  , delete: function(req, res, next) {
      res.json(204);
    }

  };
};
