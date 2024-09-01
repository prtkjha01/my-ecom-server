import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import userService from "../services/user.service";

/**
  @desc    Get User 
  @route   GET /api/v1/user/current
  @access  Private
*/
export const getUser = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return userService.getUser(req, res);
  }
);

/**
  @desc    Subscribe to newsletter
  @route   POST /api/v1/user/subscribe-to-newsletter
  @access  Public
*/
export const subscribeToNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    return userService.subscribeToNewsletter(req, res);
  }
);
