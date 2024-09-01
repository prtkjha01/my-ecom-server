import { Request, Response } from "express";
import authService from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

/**
  @desc    Register a new user
  @route   POST /api/v1/auth/register
  @access  Public
*/
export const register = asyncHandler(async (req: Request, res: Response) => {
  return authService.register(req, res);
});

/**
  @desc    Log in a user
  @route   POST /api/v1/auth/login
  @access  Public
*/
export const login = asyncHandler(async (req: Request, res: Response) => {
  return authService.login(req, res);
});

/**
  @desc    Send OTP for verification
  @route   POST /api/v1/auth/send-otp
  @access  Public
*/
export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  return authService.sendOTP(req, res);
});

/**
  @desc    Verify OTP
  @route   POST /api/v1/auth/verify-otp
  @access  Public
*/
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  return authService.verifyOTP(req, res);
});

/**
  @desc    Reset password for a user
  @route   PATCH /api/v1/auth/reset-password
  @access  Public
*/
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    return authService.resetPassword(req, res);
  }
);

/**
  @desc    Log in a user with Google
  @route   GET /api/v1/auth/google
  @access  Public
*/
export const loginWithGoogle = asyncHandler(
  async (req: Request, res: Response) => {
    return authService.loginWithGoogle(req, res);
  }
);
