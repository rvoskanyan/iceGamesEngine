import Mongoose from "mongoose";

const {Schema, model} = Mongoose;

const fields = {
  productFound: {
    type: Boolean,
    default: false,
  },
  successSaveProduct: {
    type: Boolean,
    default: true,
  },
  productDsName: String,
  needFill: [],
  byHand: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['queue', 'inWork', 'performed'],
    default: 'queue',
  },
  executor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  sourceLink: String,
};

const options = {
  timestamps: true,
  versionKey: false,
};

const parsingTaskSchema = new Schema(fields, options);

export default model('ParsingTask', parsingTaskSchema);