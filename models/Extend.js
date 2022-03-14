const {Schema, model} = require('mongoose');

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
    unique: true,
  },
};

const options = {
  timestamps: true,
};

const extendSchema = new Schema(fields, options);

module.exports = model('Extend', extendSchema);