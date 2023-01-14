import { fastify, FastifyServerOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { randomUUID } from 'crypto';
import { logger } from './logger';

export const buildApp = (opts: FastifyServerOptions = {}) => {
  const appOptions: FastifyServerOptions = {
    logger,
    genReqId: (() => {
      // use closure to store global request serial number when dev locally
      let initialRequestId = 0;
      return () =>
        process.env.NODE_ENV === 'development'
          ? String(initialRequestId++)
          : randomUUID();
    })(),
    ...opts,
  };
  const app = fastify(appOptions).withTypeProvider<TypeBoxTypeProvider>();

  // log body
  app.addHook('preHandler', function (req, reply, done) {
    const { body } = req;
    if (body) {
      req.log.info({ body }, 'parsed body');
    }
    done();
  });

  // routes go here
  app.post('/', (req, res) => {
    res.send('Hello world');
  });

  return app;
};
