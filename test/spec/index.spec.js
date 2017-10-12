import {request as handle, expect} from 'chai';
import {Server} from 'hapi';
import connector from '../../src';
import {request, get, send, header, compose} from 'midori';
import Boom from 'boom';

const basicApp = get('/test', compose(
  header('Content-Type', 'text/plain'),
  send('Test'),
));
const errorApp = get('/error', request(() => {
  throw Boom.teapot();
}));
const createApp = compose(basicApp, errorApp);

describe('hapi', () => {
  let server;

  beforeEach((done) => {
    server = new Server();
    server.connection({host: 'localhost', port: 0, compression: false});
    server.ext(connector(createApp));
    server.address = () => server.info;
    server.route({
      method: 'GET',
      path: '/',
      handler(request, reply) {
        reply('No');
      },
    });
    server.start(done);
  });

  afterEach((done) => {
    server.stop(done);
  });

  describe('normal', () => {
    it('should return a result', () => {
      return handle(server).get('/test').then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Test');
      });
    });

    it('should bubble handlers', () => {
      return handle(server).get('/').then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('No');
      });
    });
  });

  describe('errors', () => {
    it('should bubble errors', () => {
      return handle(server).get('/error').then((res) => {
        expect(res).to.have.status(418);
      });
    });
  });
});
