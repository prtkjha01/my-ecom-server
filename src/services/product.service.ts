import { Request, Response } from "express";
import Product from "../models/product.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

const createProduct = async (req: Request, res: Response) => {
  const product = new Product(req.body);
  await product.save();

  if (product) {
    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product Created Successfully"));
  } else {
    throw new ApiError(500, "Product Creation Failed");
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  const { query, page = 1, limit = 10 }: any = req.query;
  const { min_price, max_price, discount, is_assured } = req.body || {};

  const priceFilter: any = {};
  if (min_price !== undefined) {
    priceFilter.$gte = Number(min_price);
  }
  if (max_price !== undefined) {
    priceFilter.$lte = Number(max_price);
  }

  const products = await Product.find({
    $or: [
      { product_name: { $regex: new RegExp(query, "i") } },
      { brand: { $regex: new RegExp(query, "i") } },
    ],
  })
    .skip(limit * (page - 1))
    .limit(limit)
    .sort("created_at");

  if (!products) throw new ApiError(404, "Products not found");

  const total = Math.ceil(await Product.countDocuments());

  if (!products.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
          },
        },
        "No Products Found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
        },
      },
      "Products fetched Successfully"
    )
  );
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id).select("-created_at -updated_at");

  if (!product) throw new ApiError(404, "Product Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));
};

const getProductByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  const { page = 1, limit = 10 }: any = req.query;

  const products = await Product.find({ category })
    .skip(limit * (page - 1))
    .limit(limit)
    .sort("created_at");

  if (!products) throw new ApiError(404, "Products Not Found");

  const total = Math.ceil(await Product.countDocuments());

  if (!products.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
          },
        },
        "No Products Found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
        },
      },
      "Products fetched Successfully"
    )
  );
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByCategory,
};
