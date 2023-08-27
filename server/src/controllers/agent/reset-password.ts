import { genSalt, hash } from 'bcrypt';
import { RequestHandler } from 'express';
import { body } from 'express-validator';
import { NotFoundError } from '../../errors';
import Agent from '../../models/agent';

const reset_agent_password_body_validator = [
  body('agent_id').notEmpty().withMessage('agent_id on body is required...'),
];

const reset_agent_password_controller: RequestHandler = async (req, res) => {
  const { agent_id } = req.body;
  const agent = await Agent.findById(agent_id);
  if (!agent) throw new NotFoundError(`Agent not found...`);

  const { username } = agent;
  agent.password = await hash(username, await genSalt(12));
  await agent.save();

  res.status(200).json({ message: `Agent password reset!`, data: agent });
};

export { reset_agent_password_body_validator, reset_agent_password_controller };
