import mongoose from "mongoose";

const transformFunction = (doc, ret) => {
  ret.createdAt = ret.createdAt.toISOString(); // Convert to ISOString or modify as needed
  ret.updatedAt = ret.updatedAt.toISOString(); // Convert to ISOString or modify as needed
  delete ret.created_at; // Remove the camelCase keys
  delete ret.updated_at; // Remove the camelCase keys
};

var Schema = mongoose.Schema;
const AddressSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    address_line_1: {
      type: String,
      required: true,
    },

    address_line_2: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["HOME", "OFFICE"],
      default: "HOME",
    }
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { transform: transformFunction },
    toJSON: { transform: transformFunction },
  }
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
