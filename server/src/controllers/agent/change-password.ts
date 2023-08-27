import { compare, genSalt, hash } from 'bcrypt';
import { RequestHandler } from 'express';
import { body } from 'express-validator';
import { NotAuthorizedError, NotFoundError } from '../../errors';
import Agent from '../../models/agent';

const change_password_validator = [
  body('old_password')
    .isString()
    .withMessage(`old_password on body is required...`),

  body('new_password')
    .isString()
    .withMessage(`new_password on body is required...`),

  body('new_password_confirmation')
    .custom((value, { req }) => {
      return value === req.body.new_password;
    })
    .withMessage(`Password baru tidak sama...`),
];

const change_password_controller: RequestHandler = async (req, res) => {
  const { old_password, new_password } = req.body;

  const agent_id = req.current_user?.agent_id;
  if (!agent_id) throw new NotAuthorizedError();
  const agent = await Agent.findById(agent_id);
  if (!agent) throw new NotFoundError(`Agent not found...`);

  const pass_match = await compare(old_password, agent.password);
  if (!pass_match) throw new Error('Password lama salah...');

  const pass_same = await compare(new_password, agent.password);
  if (pass_same) throw new Error('Password lama dan baru tidak boleh sama...');

  agent.password = await hash(new_password, await genSalt(12));
  await agent.save();

  res.status(200).json({ message: `Change password success!`, data: agent });
};

export { change_password_validator, change_password_controller };
