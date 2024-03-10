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
