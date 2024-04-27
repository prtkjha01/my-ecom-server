import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import productService from "../services/product.service";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.createProduct(req, res);
  }
);

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getAllProducts(req, res);
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getProductById(req, res);
  }
);

export const getProductByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getProductByCategory(req, res);
  }
);

export const getCarouselProducts = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getCarouselProducts(req, res);
  }
);
