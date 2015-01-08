var _ = require('underscore')
  , factory = require('autofixture')
  , fixture = require('../fixture')
  , Validator = require('gael').Validator;

var Helper = function() {
  if (this instanceof Helper === false) return new Helper;
};

Helper.prototype.fixture = function(entity, number, data) {
  fixture(factory);

  if (_(number).isNumber()) {
    return factory.createListOf(entity, number, data);
  } else {
    data = number;
    return factory.create(entity, data);
  }
};

Helper.prototype.validate = function(schema, data, options) {
  var validator = new Validator(schema, options);
  return validator.validate(data);
};

module.exports = new Helper;