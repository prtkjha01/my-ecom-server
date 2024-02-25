import { Router, Request, Response } from "express";
import undefinedPathHandler from "./undefinedPath.router";
import productRouter from "./product.router";
import authRouter from "./auth.router";
import cartRouter from "./cart.router";
// import userRouter from "./user.router";

const router = Router();

router.use("/auth", authRouter);
// router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);

// UNDEFINED PATH HANDLER
router.use(undefinedPathHandler);

export default router;
