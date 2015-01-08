var should = require('should')
  , schema = require('../../../lib/apps/events/schemas/event')
  , helper = require('../helper');

describe('When validating event data', function() {

  var suite = this;

  describe('With valid event data', function() {

    beforeEach(function() {

      suite.data = helper.fixture('event');
      suite.data.isActive = true; // TODO support boolean in autofixturejs

      suite.validated = helper.validate(schema, suite.data);

    });

    it('should validate correctly', function() {
      suite.validated.should.exist;
    });

    it('should validate the name', function() {
      suite.validated.name.should.equal(suite.data.name);
    });

  });

  describe('With invalid event data', function() {

    beforeEach(function() {

      suite.data = helper.fixture('event');
      suite.data.isActive = true; // TODO support boolean in autofixturejs
      suite.data.name = '';
    });

    it('should not throw a validation error', function() {
      (function() {
        helper.validate(schema, suite.data);
      }).should.throw();
    });

  });

});