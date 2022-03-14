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

const regionSchema = new Schema(fields, options);

module.exports = model('Region', regionSchema);