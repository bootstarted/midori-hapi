// @flow
import type {AppCreator} from 'midori/types';
type ExtObject = {
  type: string,
  method: (request: any, reply: any) => void,
};

export default (createApp: AppCreator): ExtObject => {
  const app = createApp({
    request: (req) => {
      req.__reply.continue();
    },
    error: (err, req) => {
      if (req) {
        req.__reply(err);
      }
    },
  });
  return {
    type: 'onRequest',
    method: (request: any, reply: any) => {
      const {req, res} = request.raw;
      req.__reply = reply;
      app.request(req, res);
    },
  };
};
