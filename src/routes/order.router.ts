import { Router } from "express";
import {
  createOrder,
  handlePaymentSuccess,
} from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth";

const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.post("/payment-success", verifyToken, handlePaymentSuccess);
export default orderRouter;
