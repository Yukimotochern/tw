import { initTRPC } from '@trpc/server';
import { Context } from './context';
import type { TrpcRouterConformToApi } from '@tw/api';
import { api, okResponse, errorResponse } from '@tw/api';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        code: 'skjdkj',
      },
    };
  },
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
  .output(output.schema)
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
}) satisfies TrpcRouterConformToApi;

export type AppRouter = typeof appRouter;
