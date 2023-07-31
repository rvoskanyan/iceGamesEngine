import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    //required: true,
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
  coverImg: {
    type: String,
    //required: true,
  },
  inHome: {
    type: Boolean,
    default: false,
  },
  ourChoice: {
    type: Boolean,
    default: false,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
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