import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  dsCartId: {
    type: String,
    unique: true,
  },
};

const options = {
  timestamps: true,
};

const GuestSchema = new Schema(fields, options);

export default model('Guest', GuestSchema);