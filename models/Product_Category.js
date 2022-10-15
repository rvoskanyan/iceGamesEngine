import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  order: Number,
  inHome: {
    type: Boolean,
    default: true,
  },
};

const options = {
  timestamps: true,
};

const productCategorySchema = new Schema(fields, options);

export default model('ProductCategory', productCategorySchema);