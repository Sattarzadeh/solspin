import { CustomError } from "./CustomError";

export class InvalidResourceError extends CustomError {
  public statusCode;

  constructor(message: string = "Invalid resource", statusCode: number = 404) {
    super(message);
    Object.setPrototypeOf(this, InvalidResourceError.prototype);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
