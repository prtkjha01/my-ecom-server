import { Request, Response, NextFunction, query } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Order from "../models/order.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

// :  Promise<Response<any, Record<string, any>>>
const createOrder = async (req: AuthorizedRequest, res: Response) => {
  const { userId } = req.user;
};
export default {
  createOrder,
};
