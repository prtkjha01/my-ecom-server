import { Router } from "express";
import productRouter from "./productRouter";
import authRouter from "./authRouter";

const router = Router();

router.use(productRouter);
router.use(authRouter);

export default router;
