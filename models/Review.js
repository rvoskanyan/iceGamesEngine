import Mongoose from "mongoose";

const {Schema, model} = Mongoose;

const fields = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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
};

const reviewSchema = new Schema(fields, options);

export default model('Review', reviewSchema);