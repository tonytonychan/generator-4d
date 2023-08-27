import { NextFunction, Request, Response } from 'express';
import AgentRole from '../constants/agent-role';
import { NotAuthorizedError } from '../errors';
import { ForbiddenError } from '../errors/forbidden';

const require_master = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.current_user) throw new NotAuthorizedError();
  if (req.current_user.role !== AgentRole.Master) throw new ForbiddenError();
  next();
};

export default require_master;
