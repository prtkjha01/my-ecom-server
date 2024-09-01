import { Router } from "express";
import {
  getCart,
  createCart,
  addProducts,
  removeProduct,
  updateProductCount,
  deleteCart,
} from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/auth";

const cartRouter = Router();

cartRouter.post("/", verifyToken, createCart);
cartRouter.get("/", verifyToken, getCart);
cartRouter.patch("/add", verifyToken, addProducts);
cartRouter.patch("/remove/:id", verifyToken, removeProduct);
cartRouter.patch("/update-count/:id", verifyToken, updateProductCount);
cartRouter.delete("/", verifyToken, deleteCart);

export default cartRouter;
