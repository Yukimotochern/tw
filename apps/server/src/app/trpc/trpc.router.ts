import type { TrpcRouterConformToApi } from '@tw/api';
import { router } from './trpc';
import { userProcedure } from '../user/user.procedure';

export const appRouter = router({
  user: userProcedure,
}) satisfies TrpcRouterConformToApi;

export type AppRouter = typeof appRouter;
