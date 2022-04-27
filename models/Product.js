import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const keySchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
});

const elementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
});

const reviews = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eval: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  alias: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  dsId: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  priceTo: {
    type: Number,
    required: true,
  },
  priceFrom: Number,
  discount: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
    required: true,
  },
  coverImg: String,
  coverVideo: String,
  trailerLink: String,
  inHomeSlider: {
    type: Boolean,
    default: false,
  },
  dlc: {
    type: Boolean,
    default: false,
  },
  dlcForId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  dlcForFree: {
    type: Boolean,
    default: false,
  },
  dlcForName: String,
  preOrder: {
    type: Boolean,
    default: false,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  cpu: {
    type: String,
    required: true,
  },
  graphicsCard: {
    type: String,
    required: true,
  },
  ram: {
    type: String,
    required: true,
  },
  diskMemory: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: {
    type: [imageSchema],
    default: [],
  },
  elements: {
    type: [elementSchema],
    default: [],
  },
  keys: {
    type: [keySchema],
    default: [],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  countKeys: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: [reviews],
    default: [],
  },
  countReviews: {
    type: Number,
    default: 0,
  },
  totalEval: {
    type: Number,
    default: 0,
  },
  activationServiceId: {
    type: Schema.Types.ObjectId,
    ref: 'ActivationService',
    required: true,
  },
  publisherId: {
    type: Schema.Types.ObjectId,
    ref: 'Publisher',
    required: true,
  },
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: 'Series',
  },
  editionId: {
    type: Schema.Types.ObjectId,
    ref: 'Edition',
  },
  bundleId: {
    type: Schema.Types.ObjectId,
    ref: 'Bundle',
  },
  isOriginalInBundle: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastEditorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platformId: {
    type: Schema.Types.ObjectId,
    ref: 'Platform',
    required: true,
  },
  languages: [{
    type: Schema.Types.ObjectId,
    ref: 'Language',
  }],
  activationRegions: [{
    type: Schema.Types.ObjectId,
    ref: 'Region',
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  }],
  developers: [{
    type: Schema.Types.ObjectId,
    ref: 'Developer',
  }],
  extends: [{
    type: Schema.Types.ObjectId,
    ref: 'Extend',
  }],
  active: {
    type: Boolean,
    default: true,
  },
};

const options = {
  timestamps: true,
};

const productSchema = new Schema(fields, options);

productSchema.virtual('releaseDateForInput').get(function () {
  const product = this;
  const date = new Date(product.releaseDate);
  return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
});

export default model('Product', productSchema);