export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message?: string,
  ) {
    super(message ?? `HTTP Error ${status}: ${statusText}`);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}
