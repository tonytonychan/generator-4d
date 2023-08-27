import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import AgentRole from '../constants/agent-role';

interface AgentAttrs {
  username: string;
  password: string;
  role: AgentRole;
  active: boolean;
}

interface AgentDoc extends Document {
  username: string;
  password: string;
  role: AgentRole;
  active: boolean;
}

interface AgentModel extends Model<AgentDoc> {
  build(attrs: AgentAttrs): AgentDoc;
}

const agent_schema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret.pin;
      },
    },
  }
);

agent_schema.set('versionKey', 'version');
agent_schema.plugin(updateIfCurrentPlugin);
agent_schema.statics.build = (attrs: AgentAttrs) => new Agent({ ...attrs });
const Agent = model<AgentDoc, AgentModel>('Agent', agent_schema);
export default Agent;
