import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByCategory,
  getCarouselProducts,
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/search", getAllProducts);
productRouter.get("/carousel", getCarouselProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/by-category/:category", getProductByCategory);

export default productRouter;
