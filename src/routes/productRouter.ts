import { Router } from "express";
import {
  addMultipleProducts,
  addProducts,
  getAll,
  getProductById,
  updateProductById,
} from "../controllers/productController";
import { checkAdmin, verifyToken } from "../middlewares/auth";

const productRouter = Router();

productRouter.get("/products/get-all", getAll);

productRouter.get("/products/get/:id", getProductById);

productRouter.post(
  "/products/add-multiple",
  verifyToken as any,
  checkAdmin as any,
  addMultipleProducts as any
);

productRouter.post(
  "products/add",
  verifyToken as any,
  checkAdmin as any,
  addProducts as any
);

productRouter.patch(
  "/products/update/:id",
  verifyToken as any,
  checkAdmin as any,
  updateProductById as any
);

export default productRouter;
