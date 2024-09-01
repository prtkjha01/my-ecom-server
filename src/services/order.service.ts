import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Order from "../models/order.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import razorpay from "../utils/razorpay";
import cartService from "./cart.service";
import { sendMailWithTemplate } from "../utils/mail";

/**
 * Creates a new order using Razorpay.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response.
 * @throws {ApiError} If there is an error with Razorpay or order creation fails.
 */
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

/**
 * Handles payment success by saving the order and clearing the user's cart.
 *
 * @param {AuthorizedRequest} req - The incoming HTTP request, containing user info.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response.
 * @throws {ApiError} If order creation fails or an error occurs while sending the email or clearing the cart.
 */
const handlePaymentSuccess = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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

/**
 * Sends an order confirmation email to the user.
 *
 * @param {string} orderId - The ID of the order.
 * @param {string} email - The email address to send the confirmation to.
 * @return {Promise<void>} A promise resolving when the email is sent.
 * @throws {ApiError} If the order is not found or an error occurs while sending the email.
 */
const sendOrderEmail = async (
  orderId: string,
  email: string
): Promise<void> => {
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

/**
 * Retrieves all orders for the authenticated user.
 *
 * @param {AuthorizedRequest} req - The incoming HTTP request, containing user info.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response.
 * @throws {ApiError} If no orders are found or an error occurs while retrieving orders.
 */
const getAllOrders = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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

/**
 * Updates the status of orders based on their creation date.
 *
 * @return {Promise<void>} A promise resolving when the order statuses are updated.
 * @throws {ApiError} If an error occurs while updating the order statuses.
 */
export const updateOrderStatus = async (): Promise<void> => {
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
