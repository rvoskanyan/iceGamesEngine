import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  steamBuyName: String,
  icon: {
    type: String,
    //required: true,
  },
};

const options = {
  timestamps: true,
};

const extendSchema = new Schema(fields, options);

export default model('Extend', extendSchema);