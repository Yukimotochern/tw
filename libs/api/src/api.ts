import type { MapApiToTrpcRouter, ProcedureStructure } from './api.types';
import { user } from './user/user.api';

export const api = {
  user,
} satisfies ProcedureStructure;

export type API = typeof api;

export type TrpcRouterConformToApi = MapApiToTrpcRouter<API>;
