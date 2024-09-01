import { Response } from "express";
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
  @route   PATCH /api/v1/cart/add
  @access  Private
*/
export const addProducts = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.addProducts(req, res);
  }
);

/**
 @desc    Remove Product from cart
 @route   PATCH /api/v1/cart/remove/:id
 @access  Private
 */
export const removeProduct = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.removeProduct(req, res);
  }
);

/**
  @desc    Update product count
  @route   PATCH /api/v1/cart/update-count/:id
  @access  Private
*/
export const updateProductCount = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.updateProductCount(req, res);
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
