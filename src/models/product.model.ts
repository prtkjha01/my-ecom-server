import mongoose from "mongoose";

const transformFunction = (doc, ret) => {
  ret.createdAt = ret.createdAt.toISOString(); // Convert to ISOString or modify as needed
  ret.updatedAt = ret.updatedAt.toISOString(); // Convert to ISOString or modify as needed
  delete ret.created_at; // Remove the camelCase keys
  delete ret.updated_at; // Remove the camelCase keys
};

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
    timestamps: true,
    toObject: { transform: transformFunction },
    toJSON: { transform: transformFunction },
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
