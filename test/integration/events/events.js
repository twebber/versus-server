var request = require('supertest')
  , should = require('should')
  , slug = require('slug')
  , helper = require('../helper');

describe('/events', function() {

  var suite = this
    , agent = request.agent(helper.app);

  before(function(done) {
    helper.start(done);    
  });

  after(function(done) {
    helper.stop(done);
  });

  beforeEach(function(done) {
    helper.seed(done);
  });

  afterEach(function(done) {
    helper.clean(done);
  });

  describe('POST', function() {

    beforeEach(function() {
      suite.sample = helper.fixture('event');
    });

    beforeEach(function(done) {
      helper.signOn(function(session) {
        suite.authentication = helper.authentication(session);
        done();
      });
    });

    beforeEach(function(done) {
      agent.post('/events')
      .send({ event: suite.sample })
      .set('Accept', 'application/json')
      .set('Authorization', suite.authentication)
      .expect('Content-Type', /json/)
      .expect(200, function(err, res) {
        suite.event = res.body.event;
        done();
      });
    });

    it('respond with new event', function() {
      suite.event.should.exist;
    });

    it('event should have an id', function() {
      suite.event.id.should.exist;
    });

    it('event should have a group', function() {
      suite.event.group.should.exist;
    });

    it('event should have a generated handle', function() {
      suite.event.handle.should.equal(slug(suite.event.name));
    });

    describe('GET /:id', function() {

      beforeEach(function(done) {
        agent.get('/events/' + suite.event.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          suite.savedEvent = res.body.event;
          done();
        });
      });

      it('should retrieve saved event', function() {
        suite.savedEvent.id.should.equal(suite.event.id);
      });

    });

    describe('GET /:unknown', function() {

      it('response with 404', function(done) {
        agent.get('/events/1234')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
      });

    });

  });
});
