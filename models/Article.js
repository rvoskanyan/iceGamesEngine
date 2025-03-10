import Mongoose from "mongoose";
import {getFormatDate} from "../utils/functions.js";

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    require: true,
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
  introText: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  rightImg: {
    type: Boolean,
    default: false,
  },
  blockColor: {
    type: String,
    default: '#000',
  },
  coverImg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['news', 'article'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  blocks: [{
    img: String,
    imgPosition: {
      type: String,
      enum: ['top', 'left', 'right']
    },
    text: {
      type: String,
      required: true,
    }
  }],
  fixed: {
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
  active: {
    type: Boolean,
    default: false,
  }
};

const options = {
  timestamps: true,
  versionKey: false,
};

const articleSchema = new Schema(fields, options);

articleSchema.virtual('createdDate').get(function () {
  return getFormatDate(this.createdAt, '.', ['d', 'm', 'y']);
})

export default model('Article', articleSchema);