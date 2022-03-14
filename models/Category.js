const {Schema, model} = require('mongoose');

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
};

const options = {
  timestamps: true,
};

const categorySchema = new Schema(fields, options);

module.exports = model('Category', categorySchema);