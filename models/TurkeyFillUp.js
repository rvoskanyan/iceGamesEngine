import Mongoose from "mongoose";

const { Schema, model } = Mongoose;
const fields = {
  paymentUrl: String,
  paymentId: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  buyerEmail: String,
  denomination: Number,
  status: {
    type: String,
    required: true,
    default: 'awaiting',
    enum: ['paid', 'awaiting', 'canceled'],
  },
  yaClientId: String,
};

const options = {
  timestamps: true,
  versionKey: false,
};

const TurkeyFillUpSchema = new Schema(fields, options);

export default model('TurkeyFillUp', TurkeyFillUpSchema);