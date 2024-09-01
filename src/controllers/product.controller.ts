import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import productService from "../services/product.service";

/**
  @desc    Create a new product
  @route   POST /api/v1/product
  @access  Private
*/
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.createProduct(req, res);
  }
);

/**
  @desc    Get all products
  @route   GET /api/v1/product/search
  @access  Public
*/
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getAllProducts(req, res);
  }
);

/**
  @desc    Get products for the homepage carousel
  @route   GET /api/v1/product/carousel
  @access  Public
*/
export const getCarouselProducts = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getCarouselProducts(req, res);
  }
);

/**
  @desc    Get product by ID
  @route   GET /api/v1/product/:id
  @access  Public
*/
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getProductById(req, res);
  }
);

/**
  @desc    Get products by category
  @route   GET /api/v1/product/by-category/:category
  @access  Public
*/
export const getProductByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    return productService.getProductByCategory(req, res);
  }
);
