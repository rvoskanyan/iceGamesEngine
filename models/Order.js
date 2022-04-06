const {Schema, model} = require('mongoose');

const fields = {
  dsCartId: {
    type: String,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  buyerEmail: String,
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    purchasePrice: Number,
  }],
  status: {
    type: String,
    required: true,
    enum: ['paid', 'notPaid', 'canceled'],
  },
};

const options = {
  timestamps: true,
};

const OrderSchema = new Schema(fields, options);

module.exports = model('Order', OrderSchema);