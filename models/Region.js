import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  steamBuyName: String,
};

const options = {
  timestamps: true,
};

const regionSchema = new Schema(fields, options);

export default model('Region', regionSchema);