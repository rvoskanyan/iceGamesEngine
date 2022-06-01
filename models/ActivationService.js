import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    unique: true,
    required: true,
  },
  steamBuyName: String,
  stages: [{
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    }
  }],
}

const options = {
  timestamps: true,
}

const activationServiceSchema = new Schema(fields, options);

export default model('ActivationService', activationServiceSchema);