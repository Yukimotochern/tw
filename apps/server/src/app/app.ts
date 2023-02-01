import { fastify, FastifyServerOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';
import fastifyRedis from '@fastify/redis';
import { google } from 'googleapis';
import { logger, bodyLogger, genReqIdFunctionCreator } from './logger';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/trpc.router';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env['DATABASE_URL'],
    },
  },
});

// const oauth2Client = new google.auth.OAuth2(
//   process.env['GOOGLE_OAUTH_CLIENT_ID'],
//   process.env['GOOGLE_OAUTH_CLIENT_SECRET'],
//   process.env['GOOGLE_OAUTH_REDIRECT_URL']
// );
// const scope = [
//   'https://www.googleapis.com/auth/userinfo.email',
//   'https://www.googleapis.com/auth/userinfo.profile',
//   'openid',
// ];

// const authorizationUrl = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope,
//   include_granted_scopes: true,
// });

// const oauth2 = google.oauth2({
//   version: 'v2',
// });

// const kk = await oauth2.userinfo.get({
//   oauth_token: 'kdjksjk',
// });
// kk.data;

export const buildApp = (opts: FastifyServerOptions = {}) => {
  const appOptions: FastifyServerOptions = {
    /** use pino logger */
    logger,
    /** generate request id for each request, uuid or serial number string */
    genReqId: genReqIdFunctionCreator(),
    ...opts,
  };
  const app = fastify(appOptions).withTypeProvider<TypeBoxTypeProvider>();

  /** plugins here */
  app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    global: true,
  });
  app.register(fastifyCookie);
  app.register(fastifyRedis, {
    host: process.env.REDIS_HOST || '0.0.0.0',
  });

  /** log body if present */
  app.addHook('preHandler', bodyLogger);

  app.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  /** routes */
  app.post('/', async function (req, res) {
    res.cookie('auth', 'dssddsdsdd', {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    // await this.redis.set('user' + uuid, uuid);

    // await prisma.mainUser.create({
    //   data: {
    //     id: randomUUID(),
    //   },
    // });

    return res.send('hi');
  });

  app.get('/oauth', function (req, res) {
    // return res.redirect(301, authorizationUrl);
  });

  return app;
};
