import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  paymentType: {
    type: String,
    required: true,
    default: 'ds',
    enum: ['ds', 'dbi', 'mixed'], //ds: DigiSeller, dbi: delivery by ICE GAMES, mixed: ds & dbi
  },
  paidTypes: {
    type: [{
      type: String,
      enum: ['ds', 'dbi'],
      validate: {
        validator: function(value) {
          if (value.length > 2) {
            return false;
          }
      
          return !(value.length === 2 && value[0] === value[1]);
        },
        message: 'There are more than two values or they are repeated: {VALUE}'
      },
    }],
    default: [],
  },
  dsCartId: String,
  paymentUrl: String,
  paymentId: Number,
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  buyerEmail: String,
  dsBuyerEmail: String,
  products: [{
    purchasePrice: Number,
    dbi: Boolean,
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    required: true,
    default: 'notPaid',
    enum: ['paid', 'notPaid', 'partiallyPaid', 'canceled'],
  },
};

const options = {
  timestamps: true,
  versionKey: false,
};

const OrderSchema = new Schema(fields, options);

export default model('Order', OrderSchema);