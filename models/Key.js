import mongoose from "mongoose";

const fields = {
    value: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deactivationReason: String,
    isSold: {
        type: Boolean,
        default: false,
    },
    soldOrder: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
    },
    expired: Date,
    product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    purchasePrice: {
        type: Number,
        default: 0,
    },
    sellingPrice: Number,
}

const options = {
    timestamps: true,
    versionKey: false,
};
const schema = new mongoose.Schema(fields, options)

export default mongoose.model('Key', schema)
