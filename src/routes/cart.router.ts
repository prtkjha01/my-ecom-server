import { Router } from "express";
import {
  getCart,
  createCart,
  addProducts,
  deleteCart,
} from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/auth";

const cartRouter = Router();

cartRouter.post("/", verifyToken, createCart);
cartRouter.patch("/:id/add", verifyToken, addProducts);
cartRouter.get("/", verifyToken, getCart);
cartRouter.delete("/", verifyToken, deleteCart);

export default cartRouter;
