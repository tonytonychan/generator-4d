import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ResultAttrs {
  angka_keluar: string[];
  hasil: number;
  pasaran: string;
  total_omset: number;
  detail_set: object;
}

interface ResultDoc extends Document {
  angka_keluar: string[];
  hasil: number;
  pasaran: string;
  total_omset: number;
  detail_set: object;
}

interface ResultModel extends Model<ResultDoc> {
  build(attrs: ResultAttrs): ResultDoc;
}

const Result_schema = new Schema(
  {
    angka_keluar: { type: Array, required: true },
    hasil: { type: Number, required: true },
    pasaran: { type: String, required: true },
    total_omset: { type: Number, required: true },
    detail_set: { type: Object, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
      },
    },
  }
);

Result_schema.set('versionKey', 'version');
Result_schema.plugin(updateIfCurrentPlugin);
Result_schema.statics.build = (attrs: ResultAttrs) => new Result({ ...attrs });
const Result = model<ResultDoc, ResultModel>('Result', Result_schema);
export default Result;
