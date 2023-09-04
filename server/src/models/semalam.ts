import { Document, Model, Schema, model } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface SemalamAttrs {
  angka_keluar: string
  periode: number
  pasaran: string
  website: string
}

interface SemalamDoc extends Document {
  angka_keluar: string
  periode: number
  pasaran: string
  website: string
}

interface SemalamModel extends Model<SemalamDoc> {
  build(attrs: SemalamAttrs): SemalamDoc
}

const Semalam_schema = new Schema(
  {
    angka_keluar: { type: String, required: true },
    periode: { type: Number, required: true },
    pasaran: { type: String, required: true },
    website: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
      },
    },
  }
)

Semalam_schema.set('versionKey', 'version')
Semalam_schema.plugin(updateIfCurrentPlugin)
Semalam_schema.statics.build = (attrs: SemalamAttrs) =>
  new Semalam({ ...attrs })
const Semalam = model<SemalamDoc, SemalamModel>('Semalam', Semalam_schema)
export default Semalam
