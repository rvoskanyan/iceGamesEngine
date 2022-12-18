import Mongoose from "mongoose";


const {Schema, model} = Mongoose;

const paymentMethods = new Schema({
    name: {
        type: String,
        required: true,
    },
    icons: {
        type: String,
    },
    secretToken: {
        type: String,
        required: true
    },
    privateToken: {
        type: String,
        required: true
    },
    publicToken: {
        type: String,
    },
    webhookSecret: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
})

const paymentCheckout = new Schema({
    method_id: {
        type: String,
        required: true
    },
    checkout_url: {
        type: String,
    },
    status: {
        type: String, //Created, Waiting, Waiting-Waiting Rejected, Canceled, Success, Fail, Expire
        required: true
    },
    date_create: {
        type: Date,
    },
    date_update: {
        type: Date
    },
    checkout_expire: {
        type: Date
    },
    products_id: {
        type: [String]
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true
    },
    metadata: {
        type: String
    },
    checkoutId: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

const paymentHistory = new Schema({
    reference: {
        type: String,
        required: true
    },
    changeField: {
        type: String, // amount, metadata, currency, products_id, amount, status, checkout_url, method_id
        required: true
    },
    date_create: {
        type: Date,
    },
})


export default {
    paymentMethod: model('PaymentMethod', paymentMethods),
    paymentHistory: model('PaymentHistory', paymentHistory),
    paymentCheckout: model('PaymentCheckout', paymentCheckout)
}