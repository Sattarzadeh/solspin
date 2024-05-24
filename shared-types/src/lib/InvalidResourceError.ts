import { CustomError } from './errors/CustomError';

export class InvalidResourceError extends CustomError {
  public statusCode;

  constructor(message = 'Invalid resource', statusCode = 404) {
    super(message);
    Object.setPrototypeOf(this, InvalidResourceError.prototype);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
