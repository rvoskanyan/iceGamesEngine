import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    //required: true,
    //unique: true,
  },
  alias: {
    type: String,
    //required: true,
    //unique: true,
  },
  steamBuyName: String,
  img: {
    type: String,
    //required: true,
  },
  bgColor: {
    type: String,
    //required: true,
  },
  order: Number,
};

const options = {
  timestamps: true,
  versionKey: false,
};

const genreSchema = new Schema(fields, options);

export default model('Genre', genreSchema);