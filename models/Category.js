import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    //required: true,
    //unique: true,
  },
};

const options = {
  timestamps: true,
};

const categorySchema = new Schema(fields, options);

export default model('Category', categorySchema);