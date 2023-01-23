import { TRPCLink, createTRPCProxyClient, TRPCClientError } from '@trpc/client';
import { ProcedureType } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { get as lodashGet } from 'lodash';
import { ZodType } from 'zod';
/* eslint-disable-next-line @nrwl/nx/enforce-module-boundaries */
import type { AppRouter } from '@tw/server';
import { api } from '@tw/api';

export const removeStatusLayerLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const { path, input } = op;
      // Assert api object should contain input/output zod schema in path
      const validatorPaths = [`${path}.input`, `${path}.output`];
      const [inputValidator, outputValidator] = validatorPaths.map((vp) =>
        lodashGet(api, vp)
      );
      if (!(inputValidator instanceof ZodType)) {
        return observer.error(
          new TRPCClientError(
            `The registered object in path ${path}.input is not a ZodType. The type is ${typeof inputValidator} and it coerces to string as: ${inputValidator}. Please modify the def in api.`
          )
        );
      }
      if (!(outputValidator instanceof ZodType)) {
        return observer.error(
          new TRPCClientError(
            `The registered object in path ${path}.output is not a ZodType. The type is ${typeof outputValidator} and it coerces to string as: ${outputValidator}. Please modify the def in api.`
          )
        );
      }
      const result = inputValidator.safeParse(input);
      if (!result.success) {
        return observer.error(
          new TRPCClientError(
            `'The request to server of path: ${path} is in unexpected data format.'`,
            {
              cause: result.error,
            }
          )
        );
      }

      const unsubscribe = next(op).subscribe({
        next(value) {
          if (value.result.type === 'data') {
            const data = value.result.data;
            // validate data
            const result = outputValidator.safeParse(data);
            if (!result.success) {
              return observer.error(
                new TRPCClientError(
                  'The server response is in unexpected data format.',
                  {
                    cause: result.error,
                  }
                )
              );
            }
            // status error make observer be aware of it
            if (lodashGet(result.data, 'status') === 'error') {
              return observer.error(
                new TRPCClientError('Server response with error status.', {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  meta: value as any,
                })
              );
            }
            // status ok unwrap the data
            if (lodashGet(result.data, 'status') === 'ok') {
              value.result.data = lodashGet(result.data, 'data');
            }
          }
          observer.next(value);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

type RemoveStatusLayer<Client> = {
  [key in keyof Client]: key extends ProcedureType
    ? Client[key] extends (...rest: infer arguments) => infer response
      ? Awaited<response> & { status: 'ok' } extends { data: infer Data }
        ? (...rest: arguments) => Promise<Data>
        : never
      : never
    : RemoveStatusLayer<Client[key]>;
};
/**
 * Adjust the type of trpc client, such that errors are removed,
 * data are unwrapped from response. The real implementation is in
 * the removeStatusLayerLink.
 */
export const removeStatusLayerType: <
  Client extends ReturnType<typeof createTRPCProxyClient<AppRouter>>
>(
  client: Client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => RemoveStatusLayer<Client> = (client) => client as any;
