import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AgentRole from '../constants/agent-role';

export interface UserPayload extends JwtPayload {
  agent_id: string;
  role: AgentRole;
}

declare global {
  namespace Express {
    interface Request {
      current_user?: UserPayload;
    }
  }
}

const current_user = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.session?.token) return;

    req.current_user = jwt.verify(
      req.session.token,
      process.env.JWT_KEY!
    ) as UserPayload;
  } catch (error) {
  } finally {
    next();
  }
};

export default current_user;
