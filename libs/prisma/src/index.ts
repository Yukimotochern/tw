// import { PrismaClient } from '@prisma/client';
import { MainUserSchema } from './generated';
import { z } from 'zod';

type a = z.infer<typeof MainUserSchema>;

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env['DATABASE_URL'],
//     },
//   },
// });

export * from './generated';
