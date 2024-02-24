import mongoose from "mongoose";

var Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "CLOTHING",
        "ELECTRONICS",
        "STATIONARY",
        "FITNESS",
        "PERSONAL_CARE",
      ],
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    currency_symbol: {
      type: String,
      default: "₹",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    specifications: {
      type: [String],
      default: [],
    },

    is_assured: {
      type: Boolean,
      default: false,
    },

    faqs: {
      type: [
        {
          _id: false,
          question: String,
          answer: String,
        },
      ],
      default: [],
    },

    reviews: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Review",
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
