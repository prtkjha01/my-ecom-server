import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import asyncHandler from "../utils/asyncHandler";
import cartService from "../services/cart.service";

export const createCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.createCart(req, res);
  }
);

export const getCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.getCart(req, res);
  }
);

export const addProducts = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.addProducts(req, res);
  }
);

export const deleteCart = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return cartService.deleteCart(req, res);
  }
);
