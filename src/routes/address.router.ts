import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller";
import { verifyToken } from "../middlewares/auth";
const addressRouter = Router();

addressRouter.post("/", verifyToken, createAddress);
addressRouter.get("/", verifyToken, getAllAddresses);
addressRouter.patch("/:id", verifyToken, updateAddress);
addressRouter.delete("/:id", verifyToken, deleteAddress);

export default addressRouter;
