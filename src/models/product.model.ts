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
      required: true,
    },
    
    images: {
      type: [String],
      required: true,
    },
    
    price: {
      type: Number,
      required: true,
    },
    
    discout: {
      type: Number,
      default: 0,
    },
    
    rating: {
        type : Number,
        required: true
    },
    
    faqs: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      default : []
    },

    reviews: {
        type : [
            {
                type: mongoose.Types.ObjectId,
                ref: "Review"
            }
        ],
        default : []
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
