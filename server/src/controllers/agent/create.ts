import { genSalt, hash } from 'bcrypt';
import { RequestHandler } from 'express';
import { body } from 'express-validator';
import AgentRole from '../../constants/agent-role';
import { BadRequestError } from '../../errors';
import Agent from '../../models/agent';

const create_agent_body_validator = [
  body('username').notEmpty().withMessage('username on body is required...'),
  body('role')
    .custom(value => Object.values(AgentRole).includes(value))
    .withMessage(
      `role in body must be one of ${Object.values(AgentRole).join(' / ')}`
    ),
];

const create_agent_controller: RequestHandler = async (req, res) => {
  const { username, role } = req.body;

  const existing_agent = await Agent.findOne({ username });

  if (existing_agent) {
    throw new BadRequestError(
      `Agent with username ${username} already exists...`
    );
  }

  const hashed_password = await hash(username, await genSalt(10));

  const new_agent = Agent.build({
    password: hashed_password,
    username,
    role,
    active: true,
  });

  await new_agent.save();

  res
    .status(201)
    .json({ message: `Agent ${username} created!`, data: new_agent });
};

export { create_agent_body_validator, create_agent_controller };
