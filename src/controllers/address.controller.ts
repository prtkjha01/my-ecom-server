import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import addressService from "../services/address.service";
import { AuthorizedRequest } from "../interfaces/userInterface";

/**
  @desc    Create a new address for the user
  @route   POST /api/v1/address 
  @access  Private
*/
export const createAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.createAddress(req, res);
  }
);

/**
  @desc    Get all addresses of the user
  @route   GET /api/v1/address
  @access  Private
*/
export const getAllAddresses = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.getAllAddresses(req, res);
  }
);

/**
  @desc    Update an existing address
  @route   PATCH /api/v1/address/:id
  @access  Private
*/
export const updateAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.updateAddress(req, res);
  }
);

/**
  @desc    Delete an address
  @route   DELETE /api/v1/address/:id
  @access  Private
*/
export const deleteAddress = asyncHandler(
  async (req: AuthorizedRequest, res: Response) => {
    return addressService.deleteAddress(req, res);
  }
);
