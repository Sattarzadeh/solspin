import { CustomError } from './CustomError';

class InsufficientBalanceError extends CustomError {
  statusCode = 402;

  constructor(message = 'Insufficient balance') {
    super(message);
    Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export { InsufficientBalanceError };
