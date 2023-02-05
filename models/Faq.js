import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: Number,
};

const options = {
  timestamps: true,
  versionKey: false,
};

const faqSchema = new Schema(fields, options);

export default model('Faq', faqSchema);