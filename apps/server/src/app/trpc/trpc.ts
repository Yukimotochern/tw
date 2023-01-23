import { initTRPC } from '@trpc/server';
import { Context } from './context';
import type { API } from '@tw/api';
import { api, okResponse, errorResponse } from '@tw/api';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const router = t.router;

const kk = t.middleware(async (opt) => {
  return opt.next({
    ctx: {
      user: undefined,
    },
  });
});

const {
  kk: {
    ff: { input, output },
  },
} = api;

const publicProcedure = t.procedure
  .use(kk)
  .input(input)
  .output(output)
  .query(({ input }) => {
    if (input === '1223') {
      return errorResponse({
        code: 400,
        message: 'kkk',
        errorData: 'hkjh',
      });
    }
    return okResponse(input + 'ok' + Math.random());
  });
export const appRouter = router({
  kk: router({ ff: publicProcedure }),
}) satisfies API;

export type AppRouter = typeof appRouter;

type g = AppRouter['kk'];
