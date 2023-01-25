import { z } from 'zod';
import type { MapApiToTrpcRouter, ProcedureStructure } from './api.types';
import { response } from './server/response';

export const api = {
  kk: {
    ff: {
      input: z.string(),
      output: response(z.string())
        .error({
          code: 400,
          message: 'kkk',
          errorData: z.string(),
        })
        .error({
          code: 405,
          message: 'dkjdkj',
        }),
    },
  },
} satisfies ProcedureStructure;

export type API = typeof api;

export type TrpcRouterConformToApi = MapApiToTrpcRouter<API>;
