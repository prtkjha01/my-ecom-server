import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import orderService from "../services/order.service";

/**
  @desc    Create a new order
  @route   POST /api/v1/order
  @access  Private
*/
export const createOrder = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return orderService.createOrder(req, res);
  }
);
