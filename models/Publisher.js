import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    //unique: true,
  },
  steamBuyName: String,
};

const options = {
  timestamps: true,
  versionKey: false,
};

const publisherSchema = new Schema(fields, options);

export default model('Publisher', publisherSchema);