const {Schema, model} = require('mongoose');

const fields = {
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  dsCartId: {
    type: String,
    unique: true,
  },
};

const options = {
  timestamps: true,
};

const GuestSchema = new Schema(fields, options);

module.exports = model('Guest', GuestSchema);