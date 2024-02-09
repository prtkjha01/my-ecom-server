import mongoose from "mongoose";

const transformFunction = (doc, ret) => {
  ret.createdAt = ret.createdAt.toISOString(); // Convert to ISOString or modify as needed
  ret.updatedAt = ret.updatedAt.toISOString(); // Convert to ISOString or modify as needed
  delete ret.created_at; // Remove the camelCase keys
  delete ret.updated_at; // Remove the camelCase keys
};

var Schema = mongoose.Schema;
const ReviewSchema = new Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },

    rating: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    title: {
      type: String,
    },

    body: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: { transform: transformFunction },
    toJSON: { transform: transformFunction },
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
