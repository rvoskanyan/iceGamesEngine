import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  paymentType: {
    type: String,
    default: 'ds',
    enum: ['ds', 'dbi', 'mixed'], //ds: DigiSeller, dbi: delivery by ICE GAMES, mixed: ds & dbi
  },
  paidTypes: {
    type: [{
      type: String,
      enum: ['ds', 'dbi'],
    }],
    validate: {
      validator: (value) => !(value.length > 2 || value.length === 2 && value[0] === value[1]),
      message: 'There are more than two values or they are repeated: {VALUE}'
    },
    default: [],
  },
  products: [{
    purchasePrice: Number,
    dbi: Boolean,
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  
  dsCartId: String,
  dsBuyerEmail: String,
  isDBI: { //DBI: delivery by ICE GAMES
    type: Boolean,
    default: false,
  },
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
  yaClientId: String,
  buyerEmail: String,
  items: [{
    sellingPrice: Number,
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    required: true,
    default: 'awaiting',
    enum: ['paid', 'notPaid', 'awaiting', 'partiallyPaid', 'canceled', 'refunded', 'partialRefunded'],
  },
  messages: [String],
};

const options = {
  timestamps: true,
  versionKey: false,
};

const OrderSchema = new Schema(fields, options);

export default model('Order', OrderSchema);