import { Response } from 'express';
import { CustomError } from '@shared-errors/CustomError';

export function errorHandler(err: Error, res: Response) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() }).send();
    return;
  }
  console.log(err.message);

  res.status(500).json({ message: 'Something went wrong...' }).send();
}
