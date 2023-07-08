import { Router } from "express";
import productRouter from "./productRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const router = Router();

router.use(productRouter);
router.use(authRouter);
router.use(userRouter);
export default router;
