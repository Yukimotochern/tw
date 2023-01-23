import { z, ZodTypeAny } from 'zod';
import {
  Procedure,
  ProcedureType,
  ProcedureParams,
  AnyRootConfig,
  AnyRouter,
} from '@trpc/server';

interface ProcedureSchema {
  input: ZodTypeAny;
  output: ZodTypeAny;
}

export interface ProcedureStructure {
  [key: PropertyKey]: ProcedureSchema | ProcedureStructure;
}

export type MapApiToTrpcRouter<API extends ProcedureStructure> = {
  [key in keyof API]: API[key] extends ProcedureStructure
    ? MapApiToTrpcRouter<API[key]>
    : API[key]['input'] extends ProcedureSchema['input']
    ? API[key]['output'] extends ProcedureSchema['output']
      ? Procedure<
          ProcedureType,
          ProcedureParams<
            AnyRootConfig,
            unknown,
            z.infer<API[key]['input']>,
            z.infer<API[key]['input']>,
            z.infer<API[key]['output']>,
            z.infer<API[key]['output']>
          >
        >
      : never
    : never;
};
export type RemoveTrpcRouterErrorStatusResponse<AppRouter extends AnyRouter> = {
  [key in keyof AppRouter]: AnyRouter;
};
