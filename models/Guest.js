import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  code: {
    type: Number
  },
  try_code: {
    type: Date
  },
  yaClientIds: [String],
};

const options = {
  timestamps: true,
  versionKey: false,
};

const GuestSchema = new Schema(fields, options);

export default model('Guest', GuestSchema);