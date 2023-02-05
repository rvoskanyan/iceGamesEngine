import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
};

const options = {
  timestamps: true,
  versionKey: false,
};

const seriesSchema = new Schema(fields, options);

export default model('Series', seriesSchema);