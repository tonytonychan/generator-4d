import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { BetType } from '../constants/bet-type';

interface BetAttrs {
  website:string;
  pasaran: string;
  periode: number;
  bet_number: number;
  bet_value: number;
  bet_type: BetType;
  invoice: string;
  bet_time: Date;
  player_id: string;
  win_multiplier: number;
  player_win: number;
}

interface BetDoc extends Document {
  website:string;
  pasaran: string;
  periode: number;
  bet_number: number;
  bet_value: number;
  bet_type: BetType;
  invoice: string;
  bet_time: Date;
  player_id: string;
  win_multiplier: number;
  player_win: number;
}

interface BetModel extends Model<BetDoc> {
  build(attrs: BetAttrs): BetDoc;
}

const bet_schema = new Schema(
  {
    website: { type: String, required: true, index: true },
    pasaran: { type: String, required: true, index: true },
    periode: { type: Number, required: true, index: true },
    bet_number: { type: Number, required: true, index: true },
    bet_value: { type: Number, required: true },
    bet_type: { type: String, required: true, index: true },
    invoice: { type: String, required: true, index: true },
    bet_time: { type: Date, required: true },
    player_id: { type: String, required: true },
    win_multiplier: { type: Number, required: true },
    player_win: { type: Number, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

bet_schema.set('versionKey', 'version');
bet_schema.plugin(updateIfCurrentPlugin);
bet_schema.statics.build = (attrs: BetAttrs) => new Bet({ ...attrs });

const Bet = model<BetDoc, BetModel>('Bet', bet_schema);

export { Bet };
