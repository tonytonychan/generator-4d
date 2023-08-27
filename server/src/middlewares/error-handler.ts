import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';

const error_handler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.status_code).json(error.serialize_error());
  }

  console.error(error);

  return res.status(500).json({
    message: error.message || `Something went wrong...`,
    data: null,
  });
};

export default error_handler;
