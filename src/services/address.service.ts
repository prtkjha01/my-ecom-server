import { Request, Response } from "express";
import { AuthorizedRequest } from "../interfaces/userInterface";
import Address from "../models/address.model";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

const createAddress = async (req: AuthorizedRequest, res: Response) => {
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
const getAllAddresses = async (req: AuthorizedRequest, res: Response) => {
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

const updateAddress = async (req: Request, res: Response) => {
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

const deleteAddress = async (req: AuthorizedRequest, res: Response) => {
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
