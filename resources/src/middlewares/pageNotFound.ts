import { Request, Response, NextFunction } from 'express';
import { PageNotFoundError } from '../errors/PageNotFoundError';

export function pageNotFound(req: Request, res: Response, next: NextFunction) {
  next(new PageNotFoundError());
}
