import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
};

const options = {
  timestamps: true,
  versionKey: false,
};

const partnerSchema = new Schema(fields, options);

export default model('Partner', partnerSchema);