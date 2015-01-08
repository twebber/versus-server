module.exports = function(router, resource, authenticate, restrict, authorize, errors, cache) {

  var games = resource.games(errors, cache)
    , game = resource.game(errors, cache);

  router.get("/", authenticate, games.get);
  router.post("/", authenticate, games.post);

  router.get("/:id", authenticate, game.get);
  router.put("/:id", restrict, game.put);
  router.delete("/:id", restrict, game.delete);
};
