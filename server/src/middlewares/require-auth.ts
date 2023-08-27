import { NextFunction, Request, Response } from 'express';
import { NotAuthorizedError } from '../errors';

const require_auth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.current_user) throw new NotAuthorizedError();
  next();
};

export default require_auth;
