import mongoose from "mongoose";

var Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 0,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
