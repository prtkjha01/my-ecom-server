import mongoose from "mongoose";

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
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
