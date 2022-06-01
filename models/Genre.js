import Mongoose from 'mongoose';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    //required: true,
    //unique: true,
  },
  steamBuyName: String,
  img: {
    type: String,
    //required: true,
  },
  url: {
    type: String,
    //required: true,
    //unique: true,
  },
};

const options = {
  timestamps: true,
};

const genreSchema = new Schema(fields, options);

export default model('Genre', genreSchema);