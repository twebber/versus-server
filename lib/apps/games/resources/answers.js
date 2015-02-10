var Updater = require('../services/updater');

module.exports = function(errors, cache) {
  
  return {

    put: function(req, res, next) {
      new Updater(req.user)

      .answer(req.params.id, req.body.questions)

      .then(function(game) {
        return res.json({ game: game });
      })

      .catch(next);
    }
  
  };
};
