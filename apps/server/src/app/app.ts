import { fastify, FastifyServerOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { logger, bodyLogger, genReqIdFunctionCreator } from './logger';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/trpc';

export const buildApp = (opts: FastifyServerOptions = {}) => {
  const appOptions: FastifyServerOptions = {
    /** use pino logger */
    logger,
    /** generate request id for each request, uuid or serial number string */
    genReqId: genReqIdFunctionCreator(),
    ...opts,
  };
  const app = fastify(appOptions).withTypeProvider<TypeBoxTypeProvider>();

  /** log body if present */
  app.addHook('preHandler', bodyLogger);

  app.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  /** routes */
  app.post('/', (req, res) => {
    return res.send('hi');
  });

  return app;
};
