module.exports = function(router, resource, authenticate, restrict, authorize, errors, cache) {

  var invites = resource.invites(errors, cache)

  router.post("/", authenticate, invites.post);
};
