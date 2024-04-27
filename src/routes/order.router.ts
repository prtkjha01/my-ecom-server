import { Router } from "express";
import {
  createOrder,
  handlePaymentSuccess,
  getAllOrders,
} from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth";

const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.post("/payment-success", verifyToken, handlePaymentSuccess);
orderRouter.get("/all", verifyToken, getAllOrders);

export default orderRouter;
