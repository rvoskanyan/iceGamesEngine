import mongoose from "mongoose";

const fields = {
    name: {
        type: String,
        required: true,
    },
    icon: {
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
    isActive: {
        type: Boolean,
        default: true
    },
}

const options = {
    timestamps: true,
    versionKey: false,
};
const schema = new mongoose.Schema(fields, options)

export default {
    paymentMethod: mongoose.model('PaymentMethod', schema),
}