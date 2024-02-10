import mongoose from "mongoose";

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
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
