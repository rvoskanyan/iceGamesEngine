import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  text: {
    type: String,
    unique: true,
    required: true,
  }
};

const options = {
  timestamps: true,
};

const uspSchema = new Schema(fields, options);

export default model('Usp', uspSchema);