import { RequestHandler } from 'express';
import { param } from 'express-validator';
import Agent from '../../models/agent';
import { BadRequestError } from '../../errors';

export const non_activate_agent_validator = [
  param('agent_id').exists().withMessage(`agent_id on param is required...`),
];

export const non_activate_agent_controller: RequestHandler = async (
  req,
  res
) => {
  const agent_id = req.params.agent_id;
  const agent = await Agent.findById(agent_id);
  if (!agent)
    throw new BadRequestError(`Agent with id ${agent_id} is not found...`);

  agent.active = !agent.active;
  await agent.save();

  res.json({
    message: `Agent berhasil di${agent.active ? '' : 'non-'}aktifkan.`,
    data: agent,
  });
};
