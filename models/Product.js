import Mongoose from "mongoose";
import {getDiscount, getFormatDate} from "../utils/functions.js";
import {mailingInStockProduct} from "../services/mailer.js";

const {Schema, model} = Mongoose;

const elementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
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

const fields = {
  name: {
    type: String,
    //required: true,
    //unique: true,
    //index: true,
  },
  nameGrams: [String],
  normalizeName: String,
  soundName: [],
  shortNames: String,
  sampleTitle: String,
  sampleMetaDescription: String,
  alias: {
    type: String,
    //require: true,
    //unique: true,
    //index: true,
  },
  dsId: {
    type: Number,
    unique: true,
  },
  description: {
    type: String,
    //required: true,
  },
  priceTo: {
    type: Number,
    //required: true,
  },
  priceFrom: {
    type: Number,
    //required: true,
  },
  dsPrice: Number,
  discount: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
    //required: true,
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
    //required: true,
  },
  os: {
    type: String,
    //required: true,
  },
  cpu: {
    type: String,
    //required: true,
  },
  graphicsCard: {
    type: String,
    //required: true,
  },
  ram: {
    type: String,
    //required: true,
  },
  diskMemory: {
    type: String,
    //required: true,
  },
  recOs: {
    type: String,
    //required: true,
  },
  recCpu: {
    type: String,
    //required: true,
  },
  recGraphicsCard: {
    type: String,
    //required: true,
  },
  recRam: {
    type: String,
    //required: true,
  },
  recDiskMemory: {
    type: String,
    //required: true,
  },
  images: {
    type: [imageSchema],
    default: [],
  },
  elements: {
    type: [elementSchema],
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
    //required: true,
  },
  publisherId: {
    type: Schema.Types.ObjectId,
    ref: 'Publisher',
    //required: true,
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
    //required: true,
  },
  lastEditorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    //required: true,
  },
  platformId: {
    type: Schema.Types.ObjectId,
    ref: 'Platform',
    //required: true,
  },
  languages: String,
  recommends: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
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
  extends: [{
    type: Schema.Types.ObjectId,
    ref: 'Extend',
  }],
  darkenCover: String,
  subscribesInStock: [],
  top: {
    type: Boolean,
    default: false,
  },
  totalGradeParse: Number,
  ratingCountParse: Number,
  active: {
    type: Boolean,
    default: false,
  },
};

const options = {
  timestamps: true,
};

const productSchema = new Schema(fields, options);

productSchema.virtual('hyphenReleaseDate').get(function () {
  if (!this.releaseDate) {
    return null;
  }
  
  return getFormatDate(this.releaseDate, '-', ['y', 'm', 'd']);
});

productSchema.virtual('pointReleaseDate').get(function () {
  return getFormatDate(this.releaseDate, '.', ['d', 'm', 'y']);
});

productSchema.virtual('strMonthReleaseDate').get(function () {
  return getFormatDate(this.releaseDate, ' ', ['d', 'm', 'y'], true);
});

productSchema.methods.changeInStock = async function(inStock) {
  return new Promise(async function(resolve, reject) {
    try {
      if (this.inStock === inStock) {
        return resolve();
      }
    
      this.inStock = inStock;
    
      if (inStock) {
        mailingInStockProduct(this._id, this.subscribesInStock).then();
        this.subscribesInStock = [];
      }
    
      await this.save();
      resolve();
    } catch (e) {
      console.log(e);
      reject();
    }
  }.bind(this));
}

productSchema.methods.changePrice = async function({priceTo = null, priceFrom = null}) {
  try {
    if (this.priceTo !== priceTo || this.priceFrom !== priceFrom) {
      this.priceTo = priceTo ? priceTo : this.priceTo;
      this.priceFrom = priceFrom ? priceFrom : this.priceFrom;
      this.discount = getDiscount(this.priceTo, this.priceFrom);
      
      await this.save();
    }
  } catch (e) {
    console.log(e);
  }
}

export default model('Product', productSchema);