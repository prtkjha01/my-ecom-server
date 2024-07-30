import { Request, Response, NextFunction, query } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Order from "../models/order.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import razorpay from "../utils/razorpay";
import cartService from "./cart.service";
import { sendMailWithTemplate } from "../utils/mail";

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
  const { userId, email } = req.user;
  const order = new Order({ user: userId, ...req.body });
  await order.save();
  if (order) {
    try {
      sendOrderEmail(String(order._id), email);
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

const sendOrderEmail = async (orderId: string, email: string) => {
  const order = (await Order.findById(orderId)
    .populate({
      path: "products.product",
      select: "-created_at -updated_at -specifications -faqs -reviews",
    })
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "address",
      select: "address_line_1 address_line_2 city state pincode",
    })) as any;

  if (!order) {
    throw new ApiError(404, "Order Not Found");
  } else {
    sendMailWithTemplate(
      email,
      `Your Order(${order._id || ""}) has been placed successfully`,
      "orderPlaced.template",
      {
        name: order?.user?.name || "--",
        orderId: order?._id || "--",
        orderDate: order?.created_at,
        products: order?.products || [],
        total: order?.total || 0,
        address: `${order?.address?.address_line_1 || ""}, ${
          order?.address?.address_line_2 || ""
        }, ${order?.address?.city || ""}, ${order?.address?.state || ""}`,
      }
    );
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
      .select("-created_at -updated_at")
      .sort({ created_at: -1 });
    if (!orders) throw new ApiError(404, "No Orders Found");
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders Retrieved Successfully"));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const updateOrderStatus = async () => {
  try {
    // Get current date and time
    const now = new Date();

    // Calculate date for 1 day ago and 2 days ago
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Update status to 'SHIPPED' for orders created more than 1 day ago and not yet shipped
    await Order.updateMany(
      {
        status: "PLACED",
        created_at: { $lte: oneDayAgo },
      },
      { $set: { status: "SHIPPED" } }
    );

    // Update status to 'DELIVERED' for orders created more than 2 days ago and not yet delivered
    await Order.updateMany(
      {
        status: "SHIPPED",
        created_at: { $lte: twoDaysAgo },
      },
      { $set: { status: "DELIVERED" } }
    );

    console.log("Order statuses updated successfully");
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export default {
  createOrder,
  handlePaymentSuccess,
  getAllOrders,
};
