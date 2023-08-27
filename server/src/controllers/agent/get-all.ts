import { RequestHandler } from 'express';
import Agent from '../../models/agent';

const get_all_agents_controller: RequestHandler = async (_req, res) => {
  const agents = await Agent.find();
  res.status(200).json({ message: `Get all agents success!`, data: agents });
};

export default get_all_agents_controller;
