import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
} from "../controllers/address.controller";
import { verifyToken } from "../middlewares/auth";
const addressRouter = Router();

addressRouter.post("/", verifyToken, createAddress);
addressRouter.get("/", verifyToken, getAllAddresses);

export default addressRouter;
