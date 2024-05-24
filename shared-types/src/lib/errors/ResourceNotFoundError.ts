import { CustomError } from './CustomError';

export class ResourceNotFoundError extends CustomError {
  public statusCode;

  constructor(message = 'Invalid resource', statusCode = 404) {
    super(message);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
