import { Request, Response } from "express";
import authService from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  return authService.register(req, res);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  return authService.login(req, res);
});

export const loginWithGoogle = asyncHandler(
  async (req: Request, res: Response) => {
    return authService.loginWithGoogle(req, res);
  }
);

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  return authService.sendOTP(req, res);
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  return authService.verifyOTP(req, res);
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    return authService.resetPassword(req, res);
  }
);
