import { Router, Request, Response } from "express";
import undefinedPathHandler from "./undefinedPath.router";
import productRouter from "./product.router";
import authRouter from "./auth.router";
import cartRouter from "./cart.router";
// import userRouter from "./userRouter";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to My E-com server</h1>");
});

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
// router.use(userRouter);

// UNDEFINED PATH HANDLER
router.use(undefinedPathHandler);

export default router;
