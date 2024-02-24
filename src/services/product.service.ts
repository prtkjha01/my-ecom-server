import { Request, Response, NextFunction, query } from "express";
import Product from "../models/product.model";
import ProductModel from "../models/productModel";
import CategoryModel from "../models/categoryModel";
import UserModel from "../models/userModel";
import mongoose, { ObjectId, Query } from "mongoose";
import { User } from "../interfaces/userInterface";
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
export const getAll = async (req: Request, res: Response) => {
  try {
    const limit: number = parseInt(req.query.limit as string);
    const page: number = parseInt(req.query.page as string);

    let allProducts;
    if (limit && page) {
      allProducts = await ProductModel.find({})
        .skip(limit * (page - 1))
        .limit(limit);
    } else {
      allProducts = await ProductModel.find({});
    }
    if (allProducts.length) {
      return res.status(200).json({
        status: 200,
        message: "success",
        total: allProducts.length,
        data: allProducts,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "No products found",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const addProducts = async (req: User, res: Response) => {
  try {
    const newProduct = new ProductModel(req.body); // CREATED NEW INSTANCE OF PRODUCT, AND GOT DATA FOR PRODUCTS FROM BODY
    newProduct.createdBy = req.user.email;
    await newProduct.save(); // SAVE METHOD TO SAVE PRODUCT IN DATABASE

    // BINDING PRODUCT TO CATEGORY DB
    await CategoryModel.findByIdAndUpdate(newProduct.category, {
      $push: { products: newProduct },
    });
    return res.status(200).json({
      status: "success",
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const addMultipleProducts = async (req: User, res: Response) => {
  // ERROR IN THIS FUNCTION
  try {
    const { email } = req.user;
    const reqProducts = req.body.products;
    let productsToBeAdded: any = [];
    reqProducts.forEach((reqProduct: Object) => {
      productsToBeAdded.push({ reqProduct, createdBy: email });
    });
    // await productModel.insertMany(productsToBeAdded);
    //BINDING PRODUCT TO CATEGORY DB  <------------ THIS PART HAS ERROR
    productsToBeAdded.forEach(async (productToBeAdded: any) => {
      // try {
      console.log(productToBeAdded.category);
      const objId = new mongoose.Types.ObjectId(productToBeAdded.category);
      console.log(objId);
      // const result = await categoryModel.findByIdAndUpdate(objId, {
      //   $push: { products: productToBeAdded },
      // });
      // console.log("result ============>", result);
      // } catch (error) {
      //   console.log(error);
      //   return res.status(500).json({
      //     status: 500,
      //     message: error.message,
      //   });
      // }
    });
    return res.status(200).json({
      status: 200,
      message: "Following data inserted successfully",
      data: productsToBeAdded,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const updateProductById = async (req: User, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product Not found",
      });
    }
    const updatedBy = req.user.email;
    const userDetails = await UserModel.findOne({ email: updatedBy });
    console.log(userDetails);

    product.updatedBy = userDetails?.name;
    // const query = new Query()
    // query.$where

    let x = await product.updateOne(req.body && { updatedBy });
    console.log(x);

    return res.status(200).json({
      status: 200,
      message: "Product Detail updated",
      updatedBy,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
    });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getAll,
  getProductById,
  addProducts,
  addMultipleProducts,
  updateProductById,
};
