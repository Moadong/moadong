import { HttpError } from './HttpError';

export class ApiError extends HttpError {
  constructor(
    status: number,
    statusText: string,
    public readonly errorCode?: string,
    public readonly data?: unknown,
    message?: string,
  ) {
    super(status, statusText, message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
