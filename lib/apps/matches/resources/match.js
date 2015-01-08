var Finder = require("../services/finder")
  , Updater = require("../services/updater");

module.exports = function(errors, cache) {
  
  return {
    get: function(req, res, next) {
      new Finder(req.user)

      .get(req.params.id) 

      .then(function(match) {
        return res.json({ match: match });
      })
      
      .catch(next);
    }
    
  , put: function(req, res, next) {

      new Updater(req.user)

      .update(req.params.id, req.body.match) 

      .then(function(match) {
        return res.json({ match: match });
      })
      
      .catch(next);
    }
    
  };
};
