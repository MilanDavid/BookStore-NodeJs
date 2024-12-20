import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
        item: { type: Object, required: true },
        quantity: { type: Number, required: true },
        },
    ],
    user: {
        email: {
        type: String,
        required: true,
        },
        userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        },
    },
});

export default mongoose.model("Order", orderSchema);