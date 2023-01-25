import {
  createTRPCProxyClient,
  httpBatchLink,
  TRPCClientError,
} from '@trpc/client';
import superjson from 'superjson';

/* eslint-disable-next-line @nrwl/nx/enforce-module-boundaries */
import type { AppRouter } from '@tw/server';
import { unwrapStatusLayerLink, unwrapStatusLayerType } from '@tw/api';

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export const trpcWithStatusLayer = createTRPCProxyClient<AppRouter>({
  links: [
    unwrapStatusLayerLink,
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
  transformer: superjson,
});

export const trpc = unwrapStatusLayerType(trpcWithStatusLayer);
