import { Request, Response, NextFunction, query } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Cart from "../models/cart.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

/**
 * Creates a new cart for the specified user and returns the appropriate response.
 *
 * @param {AuthorizedRequest} req - the authorized request object
 * @param {Response<any, Record<string, any>>} res - the response object
 * @return {Promise<Response<any, Record<string, any>>>} the response promise
 */
const createCart = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId } = req.user;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      throw new ApiError(409, "Cart Already Exists");
    } else {
      const newCart = new Cart({ user: userId });
      await newCart.save();
      return res
        .status(201)
        .json(new ApiResponse(201, newCart, "Cart Created Successfully"));
    }
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

/**
 * Retrieves the user's cart and returns it as a JSON response.
 *
 * @param {AuthorizedRequest} req - the authorized request object
 * @param {Response<any, Record<string, any>>} res - the response object
 * @return {Promise<Response<any, Record<string, any>>>} JSON response with the user's cart
 */
const getCart = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId } = req.user;

  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "products.product",
      select: "-created_at -updated_at -specifications -faqs -reviews",
    })
    .select("-created_at -updated_at");
  if (!cart) {
    throw new ApiError(404, "Cart Not Found");
  } else {
    const updatedProducts = cart.products.map((product: any) => ({
      ...product.toObject(),
      subtotal: product.product.price * product.count,
    }));

    const totalSubtotal = updatedProducts.length
      ? updatedProducts.reduce(
          (total, product) => total + (product.subtotal || 0),
          0
        )
      : 0;

    const updatedCart = {
      ...cart.toObject(),
      products: updatedProducts,
      total_subtotal: totalSubtotal,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, updatedCart, "Cart Fetched Successfully"));
  }
};

/**
 * Function to add products to a cart.
 *
 * @param {AuthorizedRequest} req - the authorized request object
 * @param {Response} res - the response object
 * @return {Promise<Response<any, Record<string, any>>>} a promise that resolves when the products are added successfully
 */
const addProducts = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId } = req.user;
  const { products } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new ApiError(404, "Cart Not Found");
    } else {
      const cartId = cart._id;

      const updateOperations = products.map((productId: any) => ({
        updateOne: {
          filter: { _id: cartId, "products.product": productId },
          update: { $inc: { "products.$.count": 1 } },
        },
      }));

      const insertOperations = products.map((productId: any) => ({
        updateOne: {
          filter: { _id: cartId, "products.product": { $ne: productId } },
          update: {
            $addToSet: {
              products: { product: productId, count: 1 },
            },
          },
        },
      }));

      await Cart.bulkWrite([...updateOperations, ...insertOperations]);

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Products Added Successfully"));
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
const updateProductCount = async (req: AuthorizedRequest, res: Response) => {
  const { userId } = req.user;
  const { id: productId } = req.params;
  const { count } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart Not Found");
  } else {
    cart.products = cart.products.map((product: any) => {
      if (product.product.toString() === productId) {
        product.count = count;
      }
      return product;
    });
    await cart.save();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product Count Updated Successfully"));
  }
};
/**
 * Deletes specified product from the user's cart if it exists, and returns a success message if the deletion is successful. Throws an error if the cart does not exist or if there is an error during the deletion process.
 *
 * @param {AuthorizedRequest} req - the authorized request object
 * @param {Response} res - the response object
 * @return {Promise<Response<any, Record<string, any>>>} - a promise that resolves with the result of the deletion process
 */
const removeProduct = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId } = req.user;
  const { id: productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart Not Found !");
    } else {
      cart.products = cart.products.filter(
        (product: any) => product.product.toString() !== productId
      );
      await cart.save();

      return res.status(200).json(new ApiResponse(200, {}, "Product Removed!"));
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

/**
 * Deletes the user's cart if it exists, and returns a success message if the deletion is successful. Throws an error if the cart does not exist or if there is an error during the deletion process.
 *
 * @param {AuthorizedRequest} req - the authorized request object
 * @param {Response} res - the response object
 * @return {Promise<Response<any, Record<string, any>>>} - a promise that resolves with the result of the deletion process
 */
const deleteCart = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId } = req.user;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new ApiError(404, "Cart Not Found !");
    } else {
      await Cart.deleteOne({ user: userId });

      return res.status(200).json(new ApiResponse(200, {}, "Cart Deleted !"));
    }
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export default {
  createCart,
  getCart,
  addProducts,
  updateProductCount,
  removeProduct,
  deleteCart,
};
