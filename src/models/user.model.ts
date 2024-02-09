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
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    country: {
      type: String,
      required: true,
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
