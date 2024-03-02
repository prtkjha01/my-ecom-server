import { Request, Response, NextFunction, query } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Order from "../models/order.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import razorpay from "../utils/razorpay";

const createOrder = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit
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

const handlePaymentSuccess = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.body, "Payment Successfull"));
};

export default {
  createOrder,
  handlePaymentSuccess,
};
