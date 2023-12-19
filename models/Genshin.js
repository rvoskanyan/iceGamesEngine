import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  productID: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true
  },
  products: {
    type: Array
  }
};

const options = {
  timestamps: true,
  versionKey: false,
};

const genshinSchema = new Schema(fields, options);

export default model('Genshin', genshinSchema);
