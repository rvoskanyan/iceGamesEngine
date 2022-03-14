const {Schema, model} = require('mongoose');

const fields = {
  name: {
    type: String,
    unique: true,
    required: true,
  },
  stages: [{
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    }
  }],
}

const options = {
  timestamps: true,
}

const activationServiceSchema = new Schema(fields, options);

module.exports = model('ActivationService', activationServiceSchema);