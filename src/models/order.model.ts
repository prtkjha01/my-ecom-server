import mongoose from "mongoose";

const transformFunction = (doc, ret) => {
  ret.createdAt = ret.createdAt.toISOString(); // Convert to ISOString or modify as needed
  ret.updatedAt = ret.updatedAt.toISOString(); // Convert to ISOString or modify as needed
  delete ret.created_at; // Remove the camelCase keys
  delete ret.updated_at; // Remove the camelCase keys
};

var Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    products: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Product",
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
    
    expected_delivery_date: {
      type: Date,
    }
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { transform: transformFunction },
    toJSON: { transform: transformFunction },
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
