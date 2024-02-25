import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import cartService from "../services/cart.service";

/**
  @desc    Create a new cart for user
  @route   POST /api/v1/cart 
  @access  Private
*/
export const createCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.createCart(req, res);
  }
);

/**
  @desc    Get user's cart
  @route   GET /api/v1/cart
  @access  Private
*/
export const getCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.getCart(req, res);
  }
);

/**
  @desc    Add products to cart
  @route   PATCH /api/v1/cart/:id/add
  @access  Private
*/
export const addProducts = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.addProducts(req, res);
  }
);

/**
  @desc    Delete cart
  @route   DELETE /api/v1/cart
  @access  Private
*/
export const deleteCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.deleteCart(req, res);
  }
);
