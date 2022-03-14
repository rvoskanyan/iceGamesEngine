const {Schema, model} = require('mongoose');

const fields = {
  text: {
    type: String,
    unique: true,
    required: true,
  }
};

const options = {
  timestamps: true,
};

const uspSchema = new Schema(fields, options);

module.exports = model('Usp', uspSchema);