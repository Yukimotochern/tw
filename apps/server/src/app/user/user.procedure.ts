import { api } from '@tw/api';
import { publicProcedure, router } from '../trpc/trpc';
const { user } = api;

export const userProcedure = router({
  get: publicProcedure
    .input(user.get.input)
    .output(user.get.output.schema)
    .query(() => {
      return '' as any;
    }),
});
