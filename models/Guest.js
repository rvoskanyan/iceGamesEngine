import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  code: {
    type: String
  },
  try_code: {
    type: Date
  },
  yaId: {
    type: String
  }
};

const options = {
  timestamps: true,
};

const GuestSchema = new Schema(fields, options);

export default model('Guest', GuestSchema);