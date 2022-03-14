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

module.exports = model('User', userSchema);