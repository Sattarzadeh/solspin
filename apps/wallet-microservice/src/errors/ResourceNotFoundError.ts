import { CustomError } from "./CustomError";

export class ResourceNotFoundError extends CustomError {
  public statusCode;

  constructor(message: string = "Invalid resource", statusCode: number = 404) {
    super(message);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    this.statusCode = statusCode;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
