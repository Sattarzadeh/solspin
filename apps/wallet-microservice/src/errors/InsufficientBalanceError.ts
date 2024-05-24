class InsufficientBalanceError extends Error {
  public statusCode;

  constructor(message: string = "Insufficient balance", statusCode = 400) {
    super(message);
    this.name = "InsufficientBalanceError";
    this.statusCode = statusCode;
  }
}

export { InsufficientBalanceError };
