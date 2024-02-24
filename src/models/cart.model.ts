import mongoose from "mongoose";

var Schema = mongoose.Schema;
const CartSchema = new Schema(
  {
    products: {
      type: [
        {
          _id: false,
          product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
          },
          count: {
            type: Number,
          },
        },
      ],
      default: [],
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
