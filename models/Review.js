import Mongoose from "mongoose";

const {Schema, model} = Mongoose;

const fields = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'moderation',
    enum: ['moderation', 'rejected', 'taken'],
  },
  rejectionReason: String,
  targetId: {
    type: Schema.Types.ObjectId,
    refPath: 'target',
  },
  target: {
    type: String,
    enum: ['Product', 'FillUpSteam'],
    default: 'Product',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  eval: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
};

const options = {
  timestamps: true,
  versionKey: false,
};

const reviewSchema = new Schema(fields, options);

export default model('Review', reviewSchema);