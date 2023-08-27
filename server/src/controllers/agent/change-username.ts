import { RequestHandler } from 'express';
import { body } from 'express-validator';
import { NotFoundError } from '../../errors';
import Agent from '../../models/agent';

const change_agent_username_body_validator = [
  body('agent_id').notEmpty().withMessage('agent_id on body is required...'),
  body('new_username')
    .notEmpty()
    .withMessage('new_username on body is required...'),
];

const change_agent_username_controller: RequestHandler = async (req, res) => {
  const { agent_id, new_username } = req.body;

  const agent = await Agent.findById(agent_id);
  if (!agent) throw new NotFoundError(`Agent not found...`);

  agent.username = new_username;
  await agent.save();

  res.status(200).json({ message: `Agent username changed!`, data: agent });
};

export {
  change_agent_username_body_validator,
  change_agent_username_controller,
};
