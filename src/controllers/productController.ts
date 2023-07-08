import { Request, Response } from "express";
import { User } from "../interfaces/userInterface";
import productService from "../services/product.service";

export const getAll = async (req: Request, res: Response) => {
  return productService.getAll(req, res);
};

export const getProductById = async (req: Request, res: Response) => {
  return productService.getProductById(req, res);
};

export const addProducts = async (req: User, res: Response) => {
  return productService.addProducts(req, res);
};

export const addMultipleProducts = async (req: User, res: Response) => {
  return productService.addMultipleProducts(req, res);
};

export const updateProductById = async (req: User, res: Response) => {
  return productService.updateProductById(req, res);
};
