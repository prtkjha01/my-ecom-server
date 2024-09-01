import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import orderService from "../services/order.service";

/**
  @desc    Create a new order
  @route   POST /api/v1/order
  @access  Public
*/
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  return orderService.createOrder(req, res);
});

/**
  @desc    Handle payment success
  @route   POST /api/v1/order/payment-success
  @access  Private
*/
export const handlePaymentSuccess = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return orderService.handlePaymentSuccess(req, res);
  }
);

/**
  @desc    Get all orders
  @route   GET /api/v1/order
  @access  Private
*/
export const getAllOrders = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return orderService.getAllOrders(req, res);
  }
);
