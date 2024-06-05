import { Response } from 'express';
import { CustomError } from '@shared-errors/CustomError';

export function errorHandler(err: Error, res: Response) {
  console.log(err instanceof CustomError);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  res.status(500).json({ message: 'Something went wrong...' }).send();
}
