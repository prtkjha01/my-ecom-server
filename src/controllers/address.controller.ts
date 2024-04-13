import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import addressService from "../services/address.service";
import { AuthorizedRequest } from "../interfaces/userInterface";

export const createAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.createAddress(req, res);
  }
);

export const getAllAddresses = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.getAllAddresses(req, res);
  }
);

export const updateAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.updateAddress(req, res);
  }
);

export const deleteAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.deleteAddress(req, res);
  }
);
