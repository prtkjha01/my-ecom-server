import { Router } from "express";
import { createOrder } from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth";

const orderRouter = Router();

orderRouter.post("/", verifyToken, createOrder);

export default orderRouter;
