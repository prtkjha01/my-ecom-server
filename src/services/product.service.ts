import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/productModel";
import CategoryModel from "../models/categoryModel";
import UserModel from "../models/userModel";
import mongoose, { ObjectId, Query } from "mongoose";
import { User } from "../interfaces/userInterface";

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

export const getProductById = async (req: Request, res: Response) => {
  const { params } = req;
  const productId = new mongoose.Types.ObjectId(params.id);

  try {
    let product = await ProductModel.findById(productId);
    res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error,
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
  getAll,
  getProductById,
  addProducts,
  addMultipleProducts,
  updateProductById,
};
