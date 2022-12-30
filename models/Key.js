import mongoose from "mongoose";


const fields = {
    key: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true
    },
    expired: {
        type: Date
    },
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

let schema = new mongoose.Schema(fields, options)


export default  mongoose.model('Key', schema)
