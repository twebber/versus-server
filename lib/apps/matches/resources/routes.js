module.exports = function(router, resource, authenticate, restrict, authorize, errors, cache) {

  var matches = resource.matches(errors, cache)
    , match = resource.match(errors, cache);

  router.get("/", authenticate, matches.get);

  router.get("/:id", authenticate, match.get);
  router.put("/:id", authenticate, match.put);
};
