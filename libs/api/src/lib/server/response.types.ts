import { ZodTypeAny } from 'zod';

export interface BaseResponseError<
  Code extends number | string = number,
  Message extends string = string
> {
  code: Code;
  message: Message;
}

export interface ResponseErrorWithDataSchema<
  Code extends number | string = number,
  Message extends string = string
> extends BaseResponseError<Code, Message> {
  errorData?: ZodTypeAny;
}

export interface ResponseErrorWithData<
  ErrorType,
  Code extends number | string = number,
  Message extends string = string
> extends BaseResponseError<Code, Message> {
  errorData?: ErrorType;
}

export type ErrorResponseCreator = <
  ErrorType,
  Code extends number | string,
  Message extends string,
  errorCreatorOptionType extends ResponseErrorWithData<ErrorType, Code, Message>
>(
  error: Readonly<errorCreatorOptionType>
) => errorCreatorOptionType & { status: 'error' };
