import mongoose from "mongoose";

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
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
