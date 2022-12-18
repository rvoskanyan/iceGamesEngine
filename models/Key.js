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
    user_bought: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}

let schema = new mongoose.Schema(fields)


export default  mongoose.model('Key', schema)
