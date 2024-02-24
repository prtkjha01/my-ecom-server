import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByCategory,
} from "../controllers/product.controller";
import { checkAdmin, verifyToken } from "../middlewares/auth";

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/search", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/by-category/:category", getProductByCategory);

export default productRouter;
