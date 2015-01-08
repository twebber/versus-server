var Finder = require("../services/finder");

module.exports = function(errors, cache) {
  
  return {
    get: function(req, res, next) {

      new Finder(req.user)

      .listByUser(req.query.user) 

      .then(function(matches) {
        return res.json({ matches: matches });
      })

      .catch(next);
    }

  };
};
