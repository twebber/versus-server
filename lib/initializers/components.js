module.exports.init = function() {  
  var server = arguments[0]
    , components = Array.prototype.slice.call(arguments, 1);

  components.forEach(function(name) {

    var Component = require(name).App
      , component = new Component();

    component.init(server);
  });
};