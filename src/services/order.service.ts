import { Request, Response, NextFunction, query } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Order from "../models/order.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import razorpay from "../utils/razorpay";
import cartService from "./cart.service";

const createOrder = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await razorpay.orders.create(options);

    if (!order) throw new ApiError(500, "Razorpay Error");

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order Created Successfully"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

const handlePaymentSuccess = async (req: AuthorizedRequest, res: Response) => {
  const { userId } = req.user;
  const order = new Order({ user: userId, ...req.body });
  await order.save();
  if (order) {
    try {
      await cartService.deleteCart(req, res);
      await cartService.createCart(req, res);
      return res
        .status(201)
        .json(new ApiResponse(201, order, "Order Created Successfully"));
    } catch (error: any) {
      throw new ApiError(error.statusCode, error.message);
    }
  } else {
    throw new ApiError(500, "Order Creation Failed");
  }
};

const getAllOrders = async (req: AuthorizedRequest, res: Response) => {
  const { userId } = req.user;
  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product",
        select: "-created_at -updated_at -specifications -faqs -reviews",
      })
      .select("-created_at -updated_at");
    if (!orders) throw new ApiError(404, "No Orders Found");
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders Retrieved Successfully"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export default {
  createOrder,
  handlePaymentSuccess,
  getAllOrders,
};
