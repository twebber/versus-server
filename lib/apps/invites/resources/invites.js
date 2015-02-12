var Inviter = require("../services/inviter");

module.exports = function(errors, cache) {
  
  return {

    post: function(req, res, next) {
      new Inviter(req.user)

      .invite(req.body.user)

      .then(function(user) {
        return res.json({ user: user });
      })

      .catch(next);
    }
  
  };
};
