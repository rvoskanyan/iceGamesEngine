import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
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
  isSplit: {
    type: Boolean,
    default: false,
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
    enum: ['paid', 'awaiting', 'canceled', 'refunded', 'partialRefunded'],
  },
  messages: [String],
};

const options = {
  timestamps: true,
  versionKey: false,
};

const OrderSchema = new Schema(fields, options);

export default model('Order', OrderSchema);