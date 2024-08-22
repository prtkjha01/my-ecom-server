import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import userService from "../services/user.service";

/**
  @desc    Create a new order
  @route   POST /api/v1/order
  @access  Private
*/
export const getUser = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return userService.getUser(req, res);
  }
);

export const subscribeToNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    return userService.subscribeToNewsletter(req, res);
  }
);
