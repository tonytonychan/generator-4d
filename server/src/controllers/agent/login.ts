import { compare } from 'bcrypt';
import { RequestHandler } from 'express';
import { body } from 'express-validator';
import jwt /* , { JwtPayload } */ from 'jsonwebtoken';
import { BadRequestError } from '../../errors';
import Agent from '../../models/agent';
import { UserPayload } from '../../middlewares/current-user';
import { randomChalk } from 'ody-utils';

const log = (agent_username: string, message: string) => {
  randomChalk(`[ Login Attempt ] ${agent_username}: ${message}`);
};

const agent_login_body_validator = [
  body('username').notEmpty().withMessage('username on body is required'),
  body('password').notEmpty().withMessage('password on body is required'),
];

const agent_login_controller: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const agent = await Agent.findOne({ username });

  if (!agent) {
    log(`${username}`, `Username tidak ditemukan!`);
    throw new BadRequestError(`Login failed!`);
  }

  if (!agent.active) {
    log(`${username}`, `Username sudah dinon-aktifkan!`);
    throw new BadRequestError(`Login failed!`);
  }

  const hashed_password = agent.password;
  const password_match = await compare(password, hashed_password);

  if (!password_match) {
    log(`${username}`, `Password salah!`);
    throw new BadRequestError(`Login failed!`);
  }

  const { role } = agent;
  const payload: UserPayload = { agent_id: agent.id, role };
  const jwt_key = process.env.JWT_KEY!;
  const token = jwt.sign(payload, jwt_key, { expiresIn: '13h' });
  req.session = { token };
  res.json({ message: `Login success!` });
};

export { agent_login_body_validator, agent_login_controller };
