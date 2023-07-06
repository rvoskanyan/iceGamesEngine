import Mongoose from "mongoose";

const { Schema, model } = Mongoose;
const fields = {
  turkeyFillUpId: {
    type: Mongoose.Types.ObjectId,
    ref: 'TurkeyFillUp',
  },
  value: String,
  denomination: Number,
  purchasePrice: Number,
  sellingPrice: Number,
  isSold: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
};

const options = {
  timestamps: true,
  versionKey: false,
};

const TurkeyFillUpKeySchema = new Schema(fields, options);

export default model('TurkeyFillUpKey', TurkeyFillUpKeySchema);