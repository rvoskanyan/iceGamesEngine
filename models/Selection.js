import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    ourChoice: {
      type: Boolean,
      default: false,
    }
  }],
};

const options = {
  timestamps: true,
  versionKey: false,
};

const selectionSchema = new Schema(fields, options);

export default model('Selection', selectionSchema);