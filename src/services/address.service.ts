import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Address from "../models/address.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

/**
 * Creates a new address for the authenticated user.
 *
 * @param {AuthorizedRequest} req - The request object, containing user information and the body of the address to be created.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @returns {Promise<Response<any, Record<string, any>>>} - Returns a response with the newly created address or throws an error if the creation fails.
 *
 * @throws {ApiError} - Throws an error if the address creation fails.
 */
const createAddress = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId: user } = req.user;

  const address = new Address({ user, ...req.body });
  await address.save();
  if (address) {
    return res
      .status(201)
      .json(new ApiResponse(201, address, "Address Created Successfully"));
  } else {
    throw new ApiError(500, "Address Creation Failed");
  }
};

/**
 * Retrieves all addresses for the authenticated user.
 *
 * @param {AuthorizedRequest} req - The request object, containing user information.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @returns {Promise<Response<any, Record<string, any>>>} - Returns a response with the list of retrieved addresses or throws an error if the retrieval fails.
 *
 * @throws {ApiError} - Throws an error if the address retrieval fails.
 */
const getAllAddresses = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { userId: user } = req.user;

  const addresses = await Address.find({ user });
  if (addresses) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, addresses, "Addresses Retrieved Successfully")
      );
  } else {
    throw new ApiError(500, "Addresses Retrieval Failed");
  }
};

/**
 * Updates an existing address by its ID.
 *
 * @param {Request} req - The request object, containing the address ID in the parameters and the update data in the body.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @returns {Promise<Response<any, Record<string, any>>>} - Returns a response with the updated address or throws an error if the address is not found.
 *
 * @throws {ApiError} - Throws an error if the address is not found.
 */
const updateAddress = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { id } = req.params;
  const updates = req.body;

  const address = await Address.findByIdAndUpdate(id, updates, { new: true });
  if (!address) {
    throw new ApiError(404, "Address Not Found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, address, "Address Updated Successfully"));
  }
};

/**
 * Deletes an existing address by its ID if it belongs to the authenticated user.
 *
 * @param {AuthorizedRequest} req - The request object, containing the address ID in the parameters and user information.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @returns {Promise<Response<any, Record<string, any>>>} - Returns a response confirming the deletion or throws an error if the address is not found or access is forbidden.
 *
 * @throws {ApiError} - Throws an error if the address is not found or the user does not have access to delete it.
 */
const deleteAddress = async (
  req: AuthorizedRequest,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { id } = req.params;
  const { userId: user } = req.user;

  const address = await Address.findOneAndDelete({ _id: id, user });
  if (!address) {
    throw new ApiError(
      403,
      "Forbidden Access - You do not have access to this resource."
    );
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Address Deleted Successfully"));
  }
};

export default {
  createAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
};
