const {Schema, model} = require('mongoose');

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
};

const options = {
  timestamps: true,
};

const genreSchema = new Schema(fields, options);

module.exports = model('Genre', genreSchema);