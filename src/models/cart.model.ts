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
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
