import { z } from 'zod';
import {
  ResponseErrorWithDataSchema,
  ErrorResponseCreator,
} from './response.types';

/**
 * Usage of response:
 * const j = response(z.string())
 *   .error({
 *    code: 373,
 *    message: 'e3ee',
 *   })
 *   .error({
 *     code: 393,
 *     message: 'ddjkdj',
 *     errorData: z.string(),
 *   }).schema; // `.schema` is IMPORTANT here.
 * type ff = z.infer<typeof j>;
 */
export const response = <dataSchema extends z.ZodTypeAny>(data: dataSchema) =>
  new Response(
    z.object({
      status: z.literal('ok'),
      data,
    })
  );
export class Response<ResponseSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  constructor(public schema: ResponseSchema) {}
  /* Add more error to a response schema with fluent api */
  error: <ErrorOptions extends ResponseErrorWithDataSchema>(
    errorOptions: Readonly<ErrorOptions>
  ) => Response<
    z.ZodUnion<
      [
        ResponseSchema,
        z.ZodObject<
          {
            status: z.ZodLiteral<'error'>;
            code: z.ZodLiteral<ErrorOptions['code']>;
            message: z.ZodLiteral<ErrorOptions['message']>;
          } & (unknown extends ErrorOptions['errorData']
            ? /**
               * Here, we want to add no property if `unknown extends ErrorOptions['errorData']`, which means `errorData` is not given.
               * @typescript-eslint/ban-types recommends `Record<string, never>`
               * instead of `{}`. BUT the `never` part will distroy all other
               * properties, like `status`, `code`, `message` before the `&`
               * operator. Therefore disable eslint.
               */
              // eslint-disable-next-line @typescript-eslint/ban-types
              {}
            : { errorData: NonNullable<ErrorOptions['errorData']> })
        >
      ]
    >
  > = (errorOptions) => {
    const { code, message, errorData } = errorOptions;
    return new Response(
      this.schema.or(
        z.object({
          status: z.literal('error'),
          code: z.literal(code),
          message: z.literal(message),
          ...(errorData && { errorData }),
        })
      )
      // Conditional return type can not be inferred, disable eslint
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  };
}

export const okResponse = <Data>(data: Data) =>
  ({
    status: 'ok',
    data,
  } as const);

export const errorResponse: ErrorResponseCreator = (error) => {
  const { code, message, errorData } = error;
  return {
    status: 'error',
    code,
    message,
    ...(errorData && { errorData }),
    // Conditional return type can not be inferred, disable eslint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};
