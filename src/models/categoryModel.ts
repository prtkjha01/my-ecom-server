import mongoose from "mongoose";

const productCategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    products: {
      type: [mongoose.Types.ObjectId],
    },
  },
  { versionKey: false }
);

const CategoryModel = mongoose.model("Categories", productCategoriesSchema);

export default CategoryModel;
