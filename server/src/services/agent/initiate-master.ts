import { genSalt, hash } from 'bcrypt';
import { randomChalk } from 'ody-utils';
import AgentRole from '../../constants/agent-role';
import Agent from '../../models/agent';

const initiate_master = async () => {
  const master = await Agent.findOne({ role: AgentRole.Master });

  if (master) {
    randomChalk(`Master already exist...`);
    return;
  }

  const MASTER_USERNAME = process.env.MASTER_USERNAME!;
  const MASTER_PASSWORD = process.env.MASTER_PASSWORD!;

  const hashed_master_password = await hash(MASTER_PASSWORD, await genSalt(12));

  const new_master = Agent.build({
    password: hashed_master_password,
    role: AgentRole.Master,
    username: MASTER_USERNAME,
    active: true,
  });

  await new_master.save();
  randomChalk(`New master initiated!`);
};

export default initiate_master;
