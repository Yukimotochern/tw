import { z } from 'zod';
import type { ProcedureStructure } from '../api.types';
import { response } from '../server/response';
import { MainUserSchema } from '@tw/prisma';

export const user = {
  get: {
    input: z.any(),
    output: response(MainUserSchema),
  },
} satisfies ProcedureStructure;
