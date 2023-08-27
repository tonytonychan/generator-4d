import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../../errors';

const get_current_agent_controller: RequestHandler = async (req, res) => {
  const current_user = req.current_user;
  if (!current_user) throw new NotAuthorizedError();

  const token = req.session?.token;
  if (!token) throw new NotAuthorizedError();

  const decoded = jwt.verify(token, process.env.JWT_KEY!);
  if (!decoded) throw new NotAuthorizedError();

  res.status(200).json({
    message: `Get current agent success!`,
    data: req.current_user || null,
  });
};

export { get_current_agent_controller };
