import { CustomError } from "./CustomError";

export class PageNotFoundError extends CustomError {
  public statusCode = 404;

  constructor() {
    super("Page not found");
    Object.setPrototypeOf(this, PageNotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
