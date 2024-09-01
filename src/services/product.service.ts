import { Request, Response } from "express";
import Product from "../models/product.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

/**
 * Creates a new product in the database.
 *
 * @param {Request} req - The incoming HTTP request containing product data.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the created product.
 * @throws {ApiError} If product creation fails.
 */
const createProduct = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
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

/**
 * Retrieves all products with optional filters, sorting, and pagination.
 *
 * @param {Request} req - The incoming HTTP request containing query parameters for filters, pagination, and sorting.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the list of products.
 * @throws {ApiError} If no products are found.
 */
const getAllProducts = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const {
    query,
    page,
    limit,
    is_assured,
    min_price,
    max_price,
    min_discount,
    max_discount,
  }: any = req.query;

  let dbQuery: any = {
    $or: [
      { product_name: { $regex: new RegExp(query, "i") } },
      { brand: { $regex: new RegExp(query, "i") } },
    ],
  };
  let andQuery: any = [];

  if (min_price && max_price) {
    andQuery.push({
      price: {
        $gte: Number(min_price),
        $lte: Number(max_price),
      },
    });
  }
  if (min_discount && max_discount) {
    andQuery.push({
      discount: {
        $gte: Number(min_discount),
        $lte: Number(max_discount),
      },
    });
  }
  if (is_assured !== undefined) {
    andQuery.push({
      is_assured: is_assured.toLowerCase() == "true",
    });
  }
  if (andQuery.length) {
    dbQuery["$and"] = andQuery;
  }
  const products = await Product.find(dbQuery)
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

/**
 * Retrieves a single product by its ID.
 *
 * @param {Request} req - The incoming HTTP request containing the product ID in params.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the product data.
 * @throws {ApiError} If the product is not found.
 */
const getProductById = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { id } = req.params;
  const product = await Product.findById(id).select("-created_at -updated_at");

  if (!product) throw new ApiError(404, "Product Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));
};

/**
 * Retrieves products by category with pagination.
 *
 * @param {Request} req - The incoming HTTP request containing category in params and pagination options in query.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the list of products in the specified category.
 * @throws {ApiError} If no products are found in the specified category.
 */
const getProductByCategory = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { category } = req.params;
  const { page = 1, limit = 10 }: any = req.query;

  const products = await Product.find({ category })
    .skip(limit * (page - 1))
    .limit(limit)
    .sort("created_at");

  if (!products) throw new ApiError(404, "Products Not Found");

  const total = Math.ceil(await Product.countDocuments({ category }));

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

/**
 * Retrieves the top 6 products with the highest rating for the homepage carousel.
 *
 * @param {Request} req - The incoming HTTP request.
 * @param {Response} res - The outgoing HTTP response.
 * @return {Promise<Response<any, Record<string, any>>>} A promise resolving to the HTTP response with the carousel products.
 * @throws {ApiError} If fetching carousel products fails.
 */
const getCarouselProducts = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const carouselProducts = await Product.aggregate([
      {
        $sort: { rating: -1 },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 1,
          images: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, carouselProducts, "Products Fetched Successfully")
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByCategory,
  getCarouselProducts,
};
