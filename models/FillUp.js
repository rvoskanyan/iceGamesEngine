import mongoose from "mongoose";

const fields = {
  steamLogin: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  confirmIndicationCorrectData: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'sbp'],
  },
  type: {
    type: String,
    required: true,
    enum: ['steam'],
  },
  status: {
    type: String,
    required: true,
    enum: ['paymentAwaiting', 'success', 'pending', 'createOrderError', 'false', 'error'],
  },
  codeOrderError: Number,
  email: String,
  total: Number,
  commissionPercent: Number,
  paymentUrl: String,
  paymentId: Number,
  sbpUrl: String,
  orderId: String,
}

const options = {
  timestamps: true,
  versionKey: false,
};
const schema = new mongoose.Schema(fields, options)

export default mongoose.model('FillUp', schema)