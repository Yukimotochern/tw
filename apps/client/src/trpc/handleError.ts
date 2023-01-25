import { get as lodashGet } from 'lodash';
import { Get } from 'type-fest';
import { InvalidInputError, InvalidOutputError, API } from '@tw/api';
import { TRPCClientError } from '@trpc/client';
import { ApiProcedurePaths } from './handleError.types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const voidFunc = () => {};

const defaultHandleOption = {
  shouldRunCallbackIfAlreadyHandled: false,
  shouldSetHandled: true,
};

type HandleOption = Partial<typeof defaultHandleOption>;

export const handleError = (err: unknown) => new ErrorHandler(err);

class ErrorHandler {
  public handled = false;
  constructor(public err: unknown) {}

  private runCallbackBasedOnHandleOption(
    cb = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    const { shouldRunCallbackIfAlreadyHandled, shouldSetHandled } = {
      ...defaultHandleOption,
      ...handleOption,
    };
    const shouldRunCallback =
      !this.handled || shouldRunCallbackIfAlreadyHandled;
    if (shouldRunCallback) {
      cb();
      if (shouldSetHandled) this.handled = true;
    }
    return this;
  }

  onOtherCondition(
    cb = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    return this.runCallbackBasedOnHandleOption(cb, handleOption);
  }

  onErrorMessage(
    msg: string,
    cb = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    const { err } = this;
    if (lodashGet(err, 'message') !== msg) return this;
    return this.runCallbackBasedOnHandleOption(cb, handleOption);
  }

  onCancel(cb = voidFunc, handleOption: HandleOption = defaultHandleOption) {
    return this.onErrorMessage('canceled', cb, handleOption);
  }

  onAllButCancel(
    cb = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    const { err } = this;
    if (lodashGet(err, 'message') === 'canceled') return this;
    return this.runCallbackBasedOnHandleOption(cb, handleOption);
  }

  onInvalidInputError<Path extends ApiProcedurePaths>(
    path: Path,
    cb: (err: InvalidInputError<Get<API, Path>['input']>) => void = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    const { err } = this;
    if (!(err instanceof TRPCClientError)) {
      return this;
    }
    const { cause } = err;
    function isInvalidInputError(
      clientError: unknown
    ): clientError is InvalidInputError<Get<API, Path>['input']> {
      return cause instanceof InvalidInputError;
    }
    if (isInvalidInputError(cause)) {
      return this.runCallbackBasedOnHandleOption(() => cb(cause), handleOption);
    }
    return this;
  }

  onInvalidOutputError<Path extends ApiProcedurePaths>(
    path: Path,
    cb: (
      err: InvalidOutputError<Get<API, Path>['output']['schema']>
    ) => void = voidFunc,
    handleOption: HandleOption = defaultHandleOption
  ) {
    const { err } = this;
    if (!(err instanceof TRPCClientError)) {
      return this;
    }
    const { cause } = err;
    function isInvalidOutputError(
      clientError: unknown
    ): clientError is InvalidOutputError<Get<API, Path>['output']['schema']> {
      return cause instanceof InvalidOutputError;
    }
    if (isInvalidOutputError(cause)) {
      return this.runCallbackBasedOnHandleOption(() => cb(cause), handleOption);
    }
    return this;
  }
}
