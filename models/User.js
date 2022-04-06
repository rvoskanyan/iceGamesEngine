const {Schema, model} = require('mongoose');

const fields = {
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  invitedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  role: {
    type: String,
    required: true,
    default: 'client',
  },
  dsCartId: {
    type: String,
    unique: true,
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  viewedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  likedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  favoritesProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  emailChecked: {
    type: Boolean,
    default: false,
  },
  checkEmailHash: String,
  locked: {
    type: Boolean,
    default: false,
  },
  lockingMessage: String,
  active: {
    type: Boolean,
    default: true,
  },
};

const options = {
  timestamps: true,
};

const userSchema = new Schema(fields, options);

userSchema.virtual('daysUs').get(function () {
  const user = this;
  const startDate = user.createdAt;
  const currentDate = new Date();
  
  return Math.ceil(Math.abs(currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
});

module.exports = model('User', userSchema);