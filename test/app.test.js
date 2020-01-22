const app = require('../app');

const request = require('supertest');

describe('test_request', () => {
  describe('GET /', () => {
    it('should get 200', done => {
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('should get running', done => {
      request(app)
        .get('/')
        .expect('Running!', done);
    });
  });
});
