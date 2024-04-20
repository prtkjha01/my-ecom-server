import mongoose from "mongoose";

var Schema = mongoose.Schema;
const OrderSchema = new Schema(
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

    payment_method: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },

    status: {
      type: String,
      enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    total: {
      type: Number,
      default: 0,
    },
    razorpay_data: {
      type: Object,
      required: false,
      default: null,
    },

    expected_delivery_date: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
