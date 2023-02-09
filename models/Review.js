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
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    // required: true, Для отзывов оставленных для нашего сервиса не обязательно иметь product_id
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
  },
  type: {
    type: String,
    enum: ['product', 'our'],
    default: 'product',
    required: true,
  },
  isBest: {
    type: Boolean,
    default: false
  }
};

const options = {
  timestamps: true,
};

const reviewSchema = new Schema(fields, options);

export default model('Review', reviewSchema);