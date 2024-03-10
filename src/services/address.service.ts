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

export default {
  createAddress,
  getAllAddresses,
};
