# midori-hapi

Connect your [midori] app to [hapi].

![build status](http://img.shields.io/travis/metalabdesign/midori-hapi/master.svg?style=flat)
![coverage](https://img.shields.io/codecov/c/github/metalabdesign/midori-hapi/master.svg?style=flat)
![license](http://img.shields.io/npm/l/midori-hapi.svg?style=flat)
![version](http://img.shields.io/npm/v/midori-hapi.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/midori-hapi.svg?style=flat)

Install:

```sh
npm install --save hapi midori midori-hapi
```

Usage:

```javascript
import {Server} from 'hapi';
import connector from 'midori-hapi';
import {request, get, send, header, compose} from 'midori';
import Boom from 'boom';

// Create a midori app.
const basicApp = get('/test', compose(
  header('Content-Type', 'text/plain'),
  send('Test'),
));
const errorApp = get('/error', request(() => {
  throw Boom.teapot();
}));
const createApp = compose(basicApp, errorApp);

// Create a Hapi server.
const server = new Server();
server.connection({host: 'localhost', port: 0, compression: false});
// Connect your midori app here.
server.ext(connector(createApp));
// Start up
server.start();
```

[midori]: https://github.com/metalabdesign/midori
[hapi]: https://hapijs.com/
