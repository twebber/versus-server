var faker = require('faker');

module.exports = function(factory) {

  var name = function(i) {
    return faker.Internet.userName().toLowerCase();
  };

  var randomNumber = function(i) { 
    return faker.random.number(999999).toString() 
  };

  factory.define('event', [
    'name'.as(name)
  , 'description'
  , 'startsAt'.asDate()
  , 'price'.asNumber()
  , 'type'
  ]);

};