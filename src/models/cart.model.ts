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
