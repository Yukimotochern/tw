import { initTRPC } from '@trpc/server';
import { Context } from './context';
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

export const router = t.router;

export const publicProcedure = t.procedure;
// .input(input)
// .output(output.schema)
// .query(({ input }) => {
//   if (input === '1223') {
//     return errorResponse({
//       code: 400,
//       message: 'kkk',
//       errorData: 'hkjh',
//     });
//   }
//   return okResponse(input + 'ok' + Math.random());
// });
